import { useThemeColors } from "@/context/colors";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

type Props = {
    width: number;
    title?: string;
    author?: string;
    summary?: string;
    pages?: number;
    currentPage?: number;
    publisher?: string;
    language?: string;
    publishDate?: string;
    status?: string;
    cover?: string;
};

export function DiscoverBookCard({
    width,
    title,
    author,
    summary,
    pages,
    currentPage,
    publisher,
    language,
    publishDate,
    status,
    cover,
}: Props) {
    const c = useThemeColors();

    const handlePress = () => {
        router.push({
            pathname: "/bookInfo",
            params: {
                title,
                author,
                summary,
                pages,
                currentPage,
                publisher,
                language,
                publishDate,
                status,
                cover,
            },
        });
    };

    return (
        <Pressable
            style={{ width }}
            onPress={handlePress}
        >
            {cover ? (
                <Image
                    source={{ uri: cover }}
                    resizeMode="cover"
                    className="rounded-md"
                    style={{ width, height: width * 1.5 }}
                />
            ) : (
                <View
                    className="rounded-md items-center justify-center"
                    style={{ width, height: width * 1.5, backgroundColor: c.bgMuted }}
                >
                    <Text style={{ color: c.textFaint, fontSize: 32 }}>?</Text>
                </View>
            )}
            <Text className="mt-2 text-[13px] font-semibold" style={{ color: c.text }} numberOfLines={2}>
                {title}
            </Text>
        </Pressable>
    );
}
