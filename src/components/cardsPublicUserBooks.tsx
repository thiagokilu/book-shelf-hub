import { useThemeColors } from "@/context/colors";
import type { Book } from "@/lib/models/book";
import { router } from "expo-router";
import { FlatList, Image, Pressable, View } from "react-native";

type Props = {
    books: Book[];
};

export function CardBookPublicUser({ books }: Props) {
    const c = useThemeColors();
    return (
        <FlatList
            data={books}
            keyExtractor={(book) => String(book.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-4"
            ItemSeparatorComponent={() => <View className="w-3" />}
            renderItem={({ item }) => (
                <Pressable
                    onPress={() => {
                        router.push({
                            pathname: "/bookInfo",
                            params: {
                                id: String(item.id),
                            },
                        });
                    }}
                >
                    <Image source={{ uri: item.cover || item.coverUrl || "" }} className="h-[150px] w-[100px] rounded-lg" style={{ backgroundColor: c.bgMuted }} />
                </Pressable>
            )}
        />
    );
}
