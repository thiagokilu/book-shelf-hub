import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useThemeColors } from "@/context/colors";

type SelectOption<T> = {
    label: string;
    value: T;
};

type SelectFieldProps<T extends string> = {
    label: string;
    value: T;
    options: SelectOption<T>[];
    onSelect: (val: T) => void;
};

export function SelectField<T extends string>({
    label,
    value,
    options,
    onSelect,
}: SelectFieldProps<T>) {
    const [open, setOpen] = useState(false);
    const c = useThemeColors();
    const selectedLabel = options.find((o) => o.value === value)?.label ?? String(value);

    return (
        <View className="flex-1 gap-1.5">
            <Text className="text-xs font-semibold uppercase tracking-wide" style={{ color: c.textMuted }}>{label}</Text>

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setOpen(true)}
                className="h-12 flex-row items-center justify-between rounded-[10px] px-3"
                style={{ borderColor: c.border, backgroundColor: c.bgInput }}
            >
                <Text className="flex-1 mr-1 text-[13px]" style={{ color: c.text }} numberOfLines={1}>
                    {selectedLabel}
                </Text>
                <Ionicons name="chevron-down" size={16} color={c.textMuted} />
            </TouchableOpacity>

            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable
                    className="flex-1 justify-end bg-black/70"
                    onPress={() => setOpen(false)}
                >
                    <Pressable
                        className="max-h-[70%] rounded-t-2xl border-t p-5 pb-8"
                        style={{ borderColor: c.border, backgroundColor: c.bgCard }}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View className="flex-row items-center justify-between pb-3 mb-2 border-b" style={{ borderColor: c.border }}>
                            <Text className="text-base font-bold" style={{ color: c.text }}>{label}</Text>
                            <TouchableOpacity onPress={() => setOpen(false)} hitSlop={10}>
                                <Ionicons name="close" size={22} color={c.textMuted} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {options.map((option) => {
                                const isSelected = option.value === value;
                                return (
                                    <TouchableOpacity
                                        key={option.value}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            onSelect(option.value);
                                            setOpen(false);
                                        }}
                                        className="flex-row items-center justify-between py-3.5 px-3 rounded-lg my-0.5"
                                        style={{ backgroundColor: isSelected ? c.bgMuted : "transparent" }}
                                    >
                                        <Text
                                            className="text-sm"
                                            style={{ color: c.text, fontWeight: isSelected ? "bold" : "normal" }}
                                        >
                                            {option.label}
                                        </Text>
                                        {isSelected && (
                                            <Ionicons name="checkmark" size={18} color={c.text} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}
