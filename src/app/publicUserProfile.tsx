import { CardBookPublicUser } from "@/components/cardsPublicUserBooks";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useThemeColors } from "@/context/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MOCK_BOOKS } from "../../mock/books";


export default function PublicUserProfileScreen() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const c = useThemeColors();
    const router = useRouter();
    const { picture, name, userName } = useLocalSearchParams<{
        picture: string;
        name: string;
        userName: string;
    }>();

    return (
        <ScreenContainer>
            <TouchableOpacity
                onPress={() => router.back()}
                className="absolute left-4 z-10"
                style={{ top: insets.top + 8 }}
                accessibilityRole="button"
                accessibilityLabel={t("common.back")}
            >
                <FontAwesome name="arrow-left" size={24} color={c.text} />
            </TouchableOpacity>
            <ScrollView
                style={{ backgroundColor: c.bg }}
                contentContainerClassName="gap-8"
                contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="items-center px-4">
                    <Image source={{ uri: picture }} className="mb-3 h-[100px] w-[100px] rounded-full" style={{ backgroundColor: c.bgMuted }} />
                    <Text className="text-lg font-bold" style={{ color: c.text }}>{name}</Text>
                    <Text className="mt-0.5 text-sm" style={{ color: c.textMuted }}>@{userName}</Text>
                </View>

                <View className="gap-3">
                    <Text className="px-4 text-base font-semibold" style={{ color: c.text }}>{t("publicUserProfile.lastBooks")}</Text>
                    <CardBookPublicUser books={MOCK_BOOKS} />
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}

