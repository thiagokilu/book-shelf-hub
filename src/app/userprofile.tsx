import { CardBookPublicUser } from "@/components/cardsPublicUserBooks";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useThemeColors } from "@/context/colors";
import { useUser } from "@/context/userContext";
import type { Book } from "@/lib/models/book";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { showBookShelf } from "../lib/http/books/showbookshelf";

export default function UserProfileScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const c = useThemeColors();
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [books, setBooks] = useState<Book[]>([]);

  if (isLoading) {
    return <ScreenContainer />;
  }

  const displayedName = user?.name || "";
  const displayedUsername = user?.username || "";
  const profileImage = user?.profileImageUrl;

  useFocusEffect(
    useCallback(() => {
      async function fetchBooks() {
        try {
          const shelfData = await showBookShelf();
          if (shelfData.ok) {
            setBooks(shelfData.data);
          }
        } catch (error) {
          console.error("Error fetching books:", error);
        }
      }

      fetchBooks();
    }, []),
  );

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
      <View
        className="w-full gap-8 px-4"
        style={{ paddingTop: insets.top + 24 }}
      >
        <View className="items-center">
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              className="mb-3 h-[100px] w-[100px] rounded-full"
              style={{ backgroundColor: c.bgMuted }}
            />
          ) : (
            <FontAwesome
              name="user-circle"
              size={100}
              color={c.text}
              style={{ marginBottom: 12 }}
            />
          )}
          <Text className="text-lg font-bold" style={{ color: c.text }}>
            {displayedName}
          </Text>
          <Text className="mt-0.5 text-sm" style={{ color: c.textMuted }}>
            @{displayedUsername}
          </Text>
          {Boolean(user?.bio) && (
            <Text
              className="mt-2 text-center text-sm"
              style={{ color: c.textMuted }}
            >
              {user?.bio}
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
          <CardBookPublicUser books={books} />
        </View>
      </View>
      <TouchableOpacity
        onPress={() => router.push("/editProfile" as any)}
        className="absolute right-4 z-10"
        style={{ top: insets.top + 8 }}
        accessibilityRole="button"
        accessibilityLabel={t("publicUserProfile.editProfile")}
      >
        <FontAwesome name="pencil" size={20} color={c.text} />
      </TouchableOpacity>
    </ScreenContainer>
  );
}
