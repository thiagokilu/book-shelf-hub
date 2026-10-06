import { useThemeColors } from "@/context/colors";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

import type { Status } from "@/lib/models/book";
import { STATUS_OPTIONS } from "../constants";

type StatusFilterProps = {
    value: Status;
    onChange: (status: Status) => void;
};

export default function StatusFilter({
    value,
    onChange,
}: StatusFilterProps) {
    const { t } = useTranslation();
    const c = useThemeColors();
    return (
        <View className="gap-2">
            <Text className="text-xs font-semibold uppercase tracking-wide" style={{ color: c.textMuted }}>
                {t("filters.status")}
            </Text>

            <View className="flex-row rounded-[10px] p-1" style={{ backgroundColor: c.bgMuted }}>
                {STATUS_OPTIONS.map((option) => {
                    const isSelected = option.value === value;
                    const label = t(`filters.statusOptions.${option.value}`, { defaultValue: option.label });

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
