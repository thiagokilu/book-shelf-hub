import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Modal,
    Pressable,
    Text
} from "react-native";

import { useThemeColors } from "@/context/colors";

type SelectOption<T extends string> = {
    label: string;
    value: T;
};

type SelectProps<T extends string> = {
    value: T;
    onChange: (value: T) => void;
    options: readonly SelectOption<T>[] | SelectOption<T>[];
    placeholder?: string;
};

export function Select<T extends string>({
    value,
    onChange,
    options,
    placeholder,
}: SelectProps<T>) {
    const { t } = useTranslation();
    const c = useThemeColors();
    const [open, setOpen] = useState(false);

    const selectedOption = options.find(
        (option) => option.value === value
    );

    function handleSelect(option: SelectOption<T>) {
        onChange(option.value);
        setOpen(false);
    }

    return (
        <>
            <Pressable
                onPress={() => setOpen(true)}
                className="h-12 w-full flex-row items-center justify-between rounded-xl border px-4"
                style={{
                    backgroundColor: c.bgInput,
                    borderColor: c.border,
                }}
            >
                <Text
                    className="text-base"
                    style={{
                        color: selectedOption ? c.text : c.textMuted,
                    }}
                >
                    {selectedOption?.label ?? (placeholder ?? t("common.select"))}
                </Text>

                <Ionicons
                    name="chevron-down"
                    size={18}
                    color={c.text}
                />
            </Pressable>

            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable
                    className="flex-1 justify-center px-6"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                    onPress={() => setOpen(false)}
                >
                    <Pressable
                        className="overflow-hidden rounded-2xl border"
                        style={{
                            backgroundColor: c.bgInput,
                            borderColor: c.border,
                        }}
                        onPress={(event) => event.stopPropagation()}
                    >
                        {options.map((option) => {
                            const selected = option.value === value;

                            return (
                                <Pressable
                                    key={option.value}
                                    onPress={() => handleSelect(option)}
                                    className="flex-row items-center justify-between px-5 py-4"
                                    style={{
                                        backgroundColor: selected
                                            ? c.border
                                            : "transparent",
                                    }}
                                >
                                    <Text
                                        className="text-base"
                                        style={{ color: c.text }}
                                    >
                                        {option.label}
                                    </Text>

                                    {selected && (
                                        <Ionicons
                                            name="checkmark"
                                            size={20}
                                            color={c.text}
                                        />
                                    )}
                                </Pressable>
                            );
                        })}
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}