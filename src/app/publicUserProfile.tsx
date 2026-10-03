import { CardBookPublicUser } from "@/components/cardsPublicUserBooks";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useThemeColors } from "@/context/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getUserReading } from "../lib/http/user/getuserreading";

type ReadingBook = {
  id: string;
  title: string;
  authors: string[];
  author: string;
  cover: string;
  summary?: string;
  pages?: number;
  currentPage?: number;
  publisher?: string;
  language?: string;
  publishDate?: string;
  status?: string;
};

export default function PublicUserProfileScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const c = useThemeColors();
  const router = useRouter();
  const { picture, name, userName } = useLocalSearchParams<{
    picture?: string;
    name?: string;
    userName: string;
  }>();
  const [profileName, setProfileName] = useState(name || userName);
  const [bio, setBio] = useState<string | null>(null);
  const [books, setBooks] = useState<ReadingBook[]>([]);

  useEffect(() => {
    getUserReading(userName)
      .then((profile) => {
        setProfileName(profile.user.name);
        setBio(profile.user.bio);
        setBooks(
          profile.books.map((book) => ({
            id: book.id,
            title: book.title,
            authors: book.authors,
            author: book.authors[0] || "",
            cover: book.coverUrl || "",
            summary: book.description,
            pages: book.totalPages ?? book.pageCount,
            currentPage: book.currentPage,
            publisher: book.publisher,
            language: book.language,
            publishDate: book.publishedDate,
            status: book.status,
          })),
        );
      })
      .catch((error) => {
        console.error("Error fetching public profile:", error);
      });
  }, [userName]);

  return (
    <ScreenContainer>
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute left-4 z-10"
        style={{ top: insets.top + 8 }}
        accessibilityRole="button"
        accessibilityLabel={t("common.back")}
      >
        <FontAwesome name="arrow-left" size={24} color={c.text} />
      </TouchableOpacity>
      <ScrollView
        style={{ backgroundColor: c.bg }}
        contentContainerClassName="gap-8"
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center px-4">
          {picture ? (
            <Image
              source={{ uri: picture }}
              className="mb-3 h-[100px] w-[100px] rounded-full"
              style={{ backgroundColor: c.bgMuted }}
            />
          ) : (
            <FontAwesome name="user-circle" size={100} color={c.textMuted} />
          )}
          <Text className="text-lg font-bold" style={{ color: c.text }}>
            {profileName}
          </Text>
          <Text className="mt-0.5 text-sm" style={{ color: c.textMuted }}>
            @{userName}
          </Text>
          {Boolean(bio) && (
            <Text
              className="mt-2 text-center text-sm"
              style={{ color: c.textMuted }}
            >
              {bio}
            </Text>
          )}
        </View>

        <View className="gap-3">
          <Text
            className="px-4 text-base font-semibold"
            style={{ color: c.text }}
          >
            {t("publicUserProfile.lastBooks")}
          </Text>
          {books.length === 0 && (
            <Text className="px-4 text-center" style={{ color: c.textMuted }}>
              {t("publicUserProfile.noBooks")}
            </Text>
          )}
          {books.length > 0 && (
            <Text className="px-4 text-center" style={{ color: c.textMuted }}>
              {t("publicUserProfile.booksCount", { count: books.length })}
            </Text>
          )}
          <CardBookPublicUser books={books} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
