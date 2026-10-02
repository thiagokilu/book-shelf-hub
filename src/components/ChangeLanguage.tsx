import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Select } from "@/components/Select";
import { useThemeColors } from "@/context/colors";

export default function ChangeLanguage() {
    const { t, i18n } = useTranslation();
    const c = useThemeColors();

    const currentLanguage = i18n.language?.startsWith("pt") ? "pt" : "en";

    const languageOptions = [
        {
            label: t("settings.languages.en"),
            value: "en",
        },
        {
            label: t("settings.languages.pt"),
            value: "pt",
        },
    ] as const;

    async function handleLanguageChange(value: string) {
        await AsyncStorage.setItem("language", value);
        await i18n.changeLanguage(value);
    }

    return (
        <View className="mt-2 w-full gap-2">
            <Text
                className="text-sm font-medium"
                style={{ color: c.text }}
            >
                {t("settings.language")}
            </Text>

            <Select
                value={currentLanguage}
                onChange={handleLanguageChange}
                options={languageOptions}
            />
        </View>
    );
}