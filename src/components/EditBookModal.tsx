import { useThemeColors } from "@/context/colors";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

type EditBookModalProps = {
  visible: boolean;
  status: "WANT_TO_READ" | "READING" | "COMPLETED";
  currentPage: number;
  totalPages: number;
  onClose: () => void;
  onSave: (
    status: "WANT_TO_READ" | "READING" | "COMPLETED",
    currentPage: number,
  ) => void;
};

const STATUS_OPTIONS: { value: "WANT_TO_READ" | "READING" | "COMPLETED" }[] = [
  { value: "WANT_TO_READ" },
  { value: "READING" },
  { value: "COMPLETED" },
];

export default function EditBookModal({
  visible,
  status,
  currentPage,
  totalPages,
  onClose,
  onSave,
}: EditBookModalProps) {
  const c = useThemeColors();
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [pageInput, setPageInput] = useState(String(currentPage));

  const handleSave = () => {
    const newPage = Math.min(Math.max(0, Number(pageInput)), totalPages);
    onSave(selectedStatus, newPage);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <View
          className="w-[90%] gap-4 rounded-2xl p-6"
          style={{ backgroundColor: c.bg }}
        >
          <Text className="text-lg font-bold" style={{ color: c.text }}>
            {t("editBook.title")}
          </Text>

          <View className="gap-2">
            <Text className="text-sm font-semibold" style={{ color: c.text }}>
              {t("editBook.status")}
            </Text>
            <View className="gap-2">
              {STATUS_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setSelectedStatus(option.value)}
                  className="rounded-lg border p-3"
                  style={{
                    borderColor:
                      selectedStatus === option.value ? c.accent : c.bgMuted,
                    backgroundColor:
                      selectedStatus === option.value
                        ? c.bgMuted
                        : "transparent",
                  }}
                >
                  <Text className="text-sm" style={{ color: c.text }}>
                    {t(`status.${option.value}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-sm font-semibold" style={{ color: c.text }}>
              {t("editBook.currentPage")}
            </Text>
            <TextInput
              className="h-12 rounded-lg px-4 text-base"
              style={{
                backgroundColor: c.bgInput,
                color: c.text,
                borderColor: c.bgMuted,
                borderWidth: 1,
              }}
              placeholderTextColor={c.textFaint}
              value={pageInput}
              onChangeText={setPageInput}
              keyboardType="number-pad"
              placeholder="0"
            />
            <Text className="text-xs" style={{ color: c.textFaint }}>
              {t("editBook.totalPages", { total: totalPages })}
            </Text>
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 rounded-lg py-3"
              style={{ backgroundColor: c.bgMuted }}
            >
              <Text
                className="text-center text-sm font-semibold"
                style={{ color: c.text }}
              >
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 rounded-lg py-3"
              style={{ backgroundColor: c.accent }}
            >
              <Text
                className="text-center text-sm font-semibold"
                style={{ color: "#fff" }}
              >
                {t("common.save")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
