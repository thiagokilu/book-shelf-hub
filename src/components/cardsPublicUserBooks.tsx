import { useThemeColors } from "@/context/colors";
import { router } from "expo-router";
import { FlatList, Image, Pressable, View } from "react-native";

type Book = {
    id: number | string;
    cover: string;
    title?: string;
    author?: string;
    summary?: string;
    pages?: number;
    currentPage?: number;
    publisher?: string;
    language?: string;
    publishDate?: string;
    status?: string;
};

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
                                title: item.title,
                                author: item.author,
                                summary: item.summary,
                                pages: item.pages,
                                currentPage: item.currentPage,
                                publisher: item.publisher,
                                language: item.language,
                                publishDate: item.publishDate,
                                status: item.status,
                                cover: item.cover,
                            },
                        });
                    }}
                >
                    <Image source={{ uri: item.cover }} className="h-[150px] w-[100px] rounded-lg" style={{ backgroundColor: c.bgMuted }} />
                </Pressable>
            )}
        />
    );
}
