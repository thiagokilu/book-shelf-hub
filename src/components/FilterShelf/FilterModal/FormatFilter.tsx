import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/context/colors";

import { FORMAT_OPTIONS } from "../constants";
import type { BookFormat } from "../types";

type FormatFilterProps = {
    value: BookFormat | "ALL";
    onChange: (format: BookFormat | "ALL") => void;
};

export default function FormatFilter({
    value,
    onChange,
}: FormatFilterProps) {
    const { t } = useTranslation();
    const c = useThemeColors();
    return (
        <View className="gap-2">
            <Text className="text-xs font-semibold uppercase tracking-wide" style={{ color: c.textMuted }}>
                {t("filters.format")}
            </Text>

            <View className="flex-row rounded-[10px] p-1" style={{ backgroundColor: c.bgMuted }}>
                {FORMAT_OPTIONS.map((option) => {
                    const isSelected = option.value === value;
                    const label = t(`filters.formatOptions.${option.value}`, { defaultValue: option.label });

                    return (
                        <TouchableOpacity
                            key={option.value}
                            activeOpacity={0.7}
                            onPress={() => onChange(option.value)}
                            className="flex-1 items-center justify-center rounded-[8px] px-2 py-2.5"
                            style={{ backgroundColor: isSelected ? c.accent : "transparent" }}
                        >
                            <Text
                                className="text-xs font-semibold"
                                style={{ color: isSelected ? "#ffffff" : c.textMuted }}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}
