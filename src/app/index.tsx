import FilterShelf, {
  applyShelfFilters,
  DEFAULT_FILTERS,
} from "@/components/filterShelf";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useAuth } from "@/context/authContext";
import { useThemeColors } from "@/context/colors";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View } from "react-native";
import Toast from 'react-native-toast-message';
import type { MockBook } from "../../mock/books";
import CardBook from "../components/cardBookShelf";
import { RequestEmailVerified } from "../lib/http/auth/rquesemailverified";
import { showBookShelf } from "../lib/http/books/showbookshelf";
import { getUserProfile } from "../lib/http/user/getuserprofile";

export default function HomeScreen() {
  const [books, setBooks] = useState<MockBook[]>(() =>
    applyShelfFilters<MockBook>([], DEFAULT_FILTERS),
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const { t } = useTranslation();
  const c = useThemeColors();
  const { signOut } = useAuth();


  // useEffect(async () => {
  //   showBookShelf()
  //     .then((response) => setBooks(response.data))
  //     .then(() => RequestEmailVerified())
  //     .catch((error: unknown) => {
  //       if (error instanceof Error && error.message === "Session expired") {
  //         void signOut();
  //       }
  //       setLoadError(t("home.loadError"));
  //     })
  //     .finally(() => setLoading(false));
  // }, [t]);


  useEffect(() => {
    void (async () => {
      try {
        console.log("Loading bookshelf...");
        const response = await showBookShelf();
        console.log("Bookshelf loaded:", response.data);
        setBooks(response.data);
        //usuário não verifciado
        console.log("Loading user profile...");
        const userData = await getUserProfile();
        console.log("User profile:", userData);
        if(userData.ok && !userData.data.email_verified) {
          Toast.show({
            type: 'info',
            text1: 'Email não verificado',
            text2: 'Por favor, verifique seu email',
          });
          await RequestEmailVerified();
        }
      } catch (error) {
        console.error("Error loading home:", error);
        if (error instanceof Error && error.message === "Session expired") {
          void signOut();
        } else if (error instanceof Error && error.message === "Email not verified") {
          // Não fazer logout, mostrar toast e deixar estante vazia
          Toast.show({
            type: 'info',
            text1: 'Email não verificado',
            text2: 'Por favor, verifique seu email',
          });
          await RequestEmailVerified();
        } else {
          setLoadError(t("home.loadError"));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [t]);
  
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
