import FilterShelf, {
    applyShelfFilters,
    DEFAULT_FILTERS,
} from "@/components/filterShelf";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useAuth } from "@/context/authContext";
import { useThemeColors } from "@/context/colors";
import { useUser } from "@/context/userContext";
import type { Book } from "@/lib/models/book";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";
import CardBook from "../../components/cardBookShelf";
import Skeleton from "../../components/Skeleton";
import { RequestEmailVerified } from "../../lib/http/auth/rquesemailverified";
import { showBookShelf } from "../../lib/http/books/showbookshelf";


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
  const [books, setBooks] = useState<Book[]>(() =>
    applyShelfFilters<Book>([], DEFAULT_FILTERS),
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const { t } = useTranslation();
  const c = useThemeColors();
  const { signOut } = useAuth();
  const { user } = useUser();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      void (async () => {
        try {
          const response = await showBookShelf();
          if (isActive) {
            setBooks(response.data);
            setLoadError("");
          }
          //usuário não verifciado
          const verificationStatus = getEmailVerificationStatus(user);

          if (user && verificationStatus === false) {
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
              if (
                user &&
                getEmailVerificationStatus(user) === false
              ) {
                Toast.show({
                  type: "info",
                  text1: t("notifications.emailNotVerified"),
                  text2: t("notifications.verifyEmail"),
                });
                await RequestEmailVerified();
              }
            } catch (profileError) {

            }
          } else {
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
    }, [signOut, t, user]),
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
      {loading &&
        Array.from({ length: 6 }).map((_, index) => (
          <View key={index} style={{ flexDirection: "row", gap: 12, paddingHorizontal: 16, paddingVertical: 8 }}>
            <Skeleton width={80} height={120} borderRadius={8} />
            <View style={{ flex: 1, gap: 10, paddingTop: 4 }}>
              <Skeleton width="70%" height={16} borderRadius={4} />
              <Skeleton width="50%" height={12} borderRadius={4} />
              <Skeleton width="40%" height={12} borderRadius={4} />
              <Skeleton width="90%" height={8} borderRadius={4} style={{ marginTop: 8 }} />
            </View>
          </View>
        ))}
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
