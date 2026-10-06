import ChangeLanguage from "@/components/ChangeLanguage";
import ChangeTheme from "@/components/ChangeTheme";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useAuth } from "@/context/authContext";
import { useThemeColors } from "@/context/colors";
import { useUser } from "@/context/userContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const c = useThemeColors();
  const router = useRouter();
  const { signOut } = useAuth();
  const { user, isLoading } = useUser();

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  const displayedName = user?.name || "";
  const displayedUsername = user?.username || "";
  const profileImage = user?.profileImageUrl;

  if (isLoading) {
    return <ScreenContainer />;
  }

  const goToProfile = () => router.push("/userprofile");

  return (
    <ScreenContainer>
      <ScrollView
        style={{ backgroundColor: c.bg }}
        contentContainerClassName="gap-0 p-5 pb-10 flex flex-col items-center justify-center"
      >
        <Text
          className="mb-6 mt-10 text-[32px] font-bold"
          style={{ color: c.text }}
        >
          {t("settings.title")}
        </Text>
        <Pressable
          onPress={goToProfile}
          className="mb-3 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel={t("settings.editProfile")}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              className="h-[108px] w-[108px] rounded-full border-4 border-white"
              style={{ backgroundColor: c.bgMuted }}
            />
          ) : (
            <FontAwesome name="user-circle" size={108} color={c.text} />
          )}
          <View
            className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white"
            style={{ backgroundColor: c.text }}
          >
            <Ionicons name="pencil" size={14} color={c.bg} />
          </View>
        </Pressable>
        <Text className="text-lg font-bold" style={{ color: c.text }}>
          {displayedName}
        </Text>
        <Text className="mt-0.5 text-sm" style={{ color: c.textMuted }}>
          @{displayedUsername}
        </Text>
        <ChangeTheme />
        <ChangeLanguage />

        <Pressable
          onPress={handleLogout}
          className="mt-8 w-full items-center justify-center rounded-xl border border-red-500 px-6 py-3.5 active:opacity-70 active:bg-red-500/10"
          accessibilityRole="button"
        >
          <Text className="text-base font-semibold text-red-500">
            {t("settings.logout")}
          </Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
