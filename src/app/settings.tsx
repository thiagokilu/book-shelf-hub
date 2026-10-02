import ChangeLanguage from "@/components/ChangeLanguage";
import ChangeTheme from "@/components/ChangeTheme";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useAuth } from "@/context/authContext";
import { useThemeColors } from "@/context/colors";
import { currentUser } from "@/mocks/currentUser";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ScrollView, Text } from "react-native";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const c = useThemeColors();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <ScreenContainer>
      <ScrollView
        style={{ backgroundColor: c.bg }}
        contentContainerClassName="gap-0 p-5 pb-10 flex flex-col items-center justify-center"
      >
        <Text className="mb-6 mt-10 text-[32px] font-bold" style={{ color: c.text }}>
          {t("settings.title")}
        </Text>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/userprofile",
              params: {
                name: currentUser.name,
                userName: currentUser.userName,
                picture: currentUser.picture,
              },
            })
          }
        >
          <Image
            source={{ uri: currentUser.picture }}
            className="mb-3 h-[100px] w-[100px] rounded-full"
            style={{ backgroundColor: c.bgMuted }}
          />
        </Pressable>

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