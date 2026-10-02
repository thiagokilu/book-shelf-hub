import { ScreenContainer } from "@/components/ScreenContainer";
import { useThemeColors } from "@/context/colors";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const c = useThemeColors();
  return (
    <ScreenContainer>
      <Text className="text-[32px] font-bold" style={{ color: c.text }}>{t("profile.title")}</Text>
    </ScreenContainer>
  );
}
