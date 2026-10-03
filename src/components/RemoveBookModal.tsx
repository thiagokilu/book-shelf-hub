import { useThemeColors } from "@/context/colors";
import { useTranslation } from "react-i18next";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type RemoveBookModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function RemoveBookModal({
  visible,
  onClose,
  onConfirm,
}: RemoveBookModalProps) {
  const c = useThemeColors();
  const { t } = useTranslation();

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
            {t("removeBook.title")}
          </Text>
          <Text className="text-base" style={{ color: c.text }}>
            {t("removeBook.message")}
          </Text>

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
                {t("removeBook.no")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 rounded-lg py-3"
              style={{ backgroundColor: c.accent }}
            >
              <Text
                className="text-center text-sm font-semibold"
                style={{ color: "#fff" }}
              >
                {t("removeBook.yes")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
