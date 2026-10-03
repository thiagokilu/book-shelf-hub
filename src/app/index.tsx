import FilterShelf, {
  applyShelfFilters,
  DEFAULT_FILTERS,
} from "@/components/filterShelf";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useAuth } from "@/context/authContext";
import { useThemeColors } from "@/context/colors";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import type { MockBook } from "../../mock/books";
import CardBook from "../components/cardBookShelf";
import { RequestEmailVerified } from "../lib/http/auth/rquesemailverified";
import { showBookShelf } from "../lib/http/books/showbookshelf";
import { getUserProfile } from "../lib/http/user/getuserprofile";

const getEmailVerificationStatus = (data: any): boolean | undefined => {
  const user = data?.user ?? data?.data?.user ?? data?.data ?? data;
  const value =
    user?.emailVerified ??
    user?.email_verified ??
    user?.isEmailVerified ??
    user?.is_email_verified;

  if (value === true || value === 1 || value === "1") return true;
  if (value === false || value === 0 || value === "0") return false;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return undefined;
};

export default function HomeScreen() {
  const [books, setBooks] = useState<MockBook[]>(() =>
    applyShelfFilters<MockBook>([], DEFAULT_FILTERS),
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const { t } = useTranslation();
  const c = useThemeColors();
  const { signOut } = useAuth();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      void (async () => {
        try {
          console.log("Loading bookshelf...");
          const response = await showBookShelf();
          console.log("Bookshelf loaded:", response.data);
          if (isActive) {
            setBooks(response.data);
            setLoadError("");
          }
          //usuário não verifciado
          console.log("Loading user profile...");
          const userData = await getUserProfile();
          console.log("User profile:", userData);
          const verificationStatus = getEmailVerificationStatus(userData.data);

          if (userData.ok && verificationStatus === false) {
            Toast.show({
              type: "info",
              text1: t("notifications.emailNotVerified"),
              text2: t("notifications.verifyEmail"),
            });
            await RequestEmailVerified();
          }
        } catch (error) {
          console.error("Error loading home:", error);
          if (error instanceof Error && error.message === "Session expired") {
            void signOut();
          } else if (
            error instanceof Error &&
            error.message === "Email not verified"
          ) {
            // Confirma pelo perfil antes de avisar: a resposta da estante pode
            // estar desatualizada em relação à verificação mais recente.
            try {
              const userData = await getUserProfile();
              if (
                userData.ok &&
                getEmailVerificationStatus(userData.data) === false
              ) {
                Toast.show({
                  type: "info",
                  text1: t("notifications.emailNotVerified"),
                  text2: t("notifications.verifyEmail"),
                });
                await RequestEmailVerified();
              }
            } catch (profileError) {
              console.error(
                "Could not confirm email verification:",
                profileError,
              );
            }
          } else {
            console.log("Other error:", error);
            setLoadError(t("home.loadError"));
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      })();

      return () => {
        isActive = false;
      };
    }, [signOut, t]),
  );

  return (
    <ScreenContainer>
      <View className="mt-[60px] mb-2 w-full px-4">
        <Text className="mb-1 text-[32px] font-bold" style={{ color: c.text }}>
          {t("home.title")}
        </Text>
        <FilterShelf
          books={books}
          onChange={(_filters, result) => setBooks(result)}
        />
      </View>
      {loading && <ActivityIndicator color={c.accent} />}
      {!loading && loadError !== "" && (
        <Text className="px-4 text-center" style={{ color: c.textMuted }}>
          {loadError}
        </Text>
      )}
      {!loading && loadError === "" && books.length === 0 && (
        <Text className="px-4 text-center" style={{ color: c.textMuted }}>
          {t("home.empty")}
        </Text>
      )}
      {!loading && books.map((book) => <CardBook key={book.id} {...book} />)}
    </ScreenContainer>
  );
}
