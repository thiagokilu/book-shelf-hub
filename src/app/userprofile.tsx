import { CardBookPublicUser } from "@/components/cardsPublicUserBooks";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useThemeColors } from "@/context/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { MockBook } from "../../mock/books";
import { showBookShelf } from "../lib/http/books/showbookshelf";
import { getUserProfile } from "../lib/http/user/getuserprofile";

type UserProfile = {
  bio?: string | null;
  name?: string | null;
  profileImageUrl?: string | null;
  picture?: string | null;
  username?: string | null;
  userName?: string | null;
};

export default function UserProfileScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const c = useThemeColors();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [books, setBooks] = useState<MockBook[]>([]);

  const displayedName = user?.name || "";
  const displayedUsername = user?.username || user?.userName || "";
  const profileImage = user?.profileImageUrl || user?.picture;

  useFocusEffect(
    useCallback(() => {
      async function fetchProfile() {
        try {
          const userData = await getUserProfile();
          console.log("User profile:", userData);
          if (userData.ok) {
            setUser(userData.data.user);
          }

          const shelfData = await showBookShelf();
          if (shelfData.ok) {
            setBooks(shelfData.data);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }

      fetchProfile();
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
