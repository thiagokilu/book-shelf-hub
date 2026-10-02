import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Select } from "@/components/Select";
import { useTheme } from "@/context/ThemeContext";
import { useThemeColors } from "@/context/colors";

export default function ChangeTheme() {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const c = useThemeColors();

    return (
        <View className="mt-2 w-full gap-2">
            <Text
                className="text-sm font-medium"
                style={{ color: c.text }}
            >
                {t("settings.theme")}
            </Text>

            <Select
                value={theme}
                onChange={setTheme}
                options={[
                    {
                        label: t("settings.themes.dark"),
                        value: "dark",
                    },
                    {
                        label: t("settings.themes.light"),
                        value: "light",
                    },
                ]}
            />
        </View>
    );
}