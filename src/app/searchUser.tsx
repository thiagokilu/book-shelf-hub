import { router } from "expo-router";
import { useThemeColors } from "@/context/colors";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    Image,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type User = {
    id: number;
    name: string;
    userName: string;
    image: string;
};

const USERS: User[] = [
    { id: 1, name: "Thiago", userName: "thiago", image: "https://picsum.photos/seed/user1/400" },
    { id: 2, name: "João", userName: "joao", image: "https://picsum.photos/seed/user2/400" },
    { id: 3, name: "Maria", userName: "maria", image: "https://picsum.photos/seed/user3/400" },
    { id: 4, name: "Lucas", userName: "lucas", image: "https://picsum.photos/seed/user4/400" },
    { id: 5, name: "Thiago", userName: "thiago", image: "https://picsum.photos/seed/user5/400" },
    { id: 6, name: "Thiago", userName: "thiago", image: "https://picsum.photos/seed/user6/400" },
];

export default function SearchUserScreen() {
    const { t } = useTranslation();
    const [query, setQuery] = useState("");
    const insets = useSafeAreaInsets();
    const c = useThemeColors();

    const users = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (q === "") return [];

        return USERS.filter(
            (user) =>
                user.name.toLowerCase().includes(q) ||
                user.userName.toLowerCase().includes(q)
        );
    }, [query]);

    const showEmpty = query.trim() !== "" && users.length === 0;

    return (
        <View className="flex-1" style={{ backgroundColor: c.bg }}>
            <FlatList
                data={users}
                keyExtractor={(user) => String(user.id)}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                style={{ backgroundColor: c.bg }}
                contentContainerClassName="px-4 pb-6"
                ListHeaderComponent={
                    <View
                        className="pb-4"
                        style={{ paddingTop: insets.top + 8 }}
                    >
                        <TextInput
                            className="h-11 w-full rounded-[10px] px-3.5 text-[15px]"
                            style={{ backgroundColor: c.bgInput, color: c.text }}
                            placeholder={t("searchUser.searchPlaceholder")}
                            placeholderTextColor={c.textFaint}
                            value={query}
                            onChangeText={setQuery}
                            returnKeyType="search"
                            autoCorrect={false}
                            autoCapitalize="none"
                            clearButtonMode="while-editing"
                        />
                    </View>
                }
                ItemSeparatorComponent={() => (
                    <View className="h-px" style={{ backgroundColor: c.borderMuted }} />
                )}
                ListEmptyComponent={
                    showEmpty ? (
                        <Text className="mt-8 text-center" style={{ color: c.textFaint }}>
                            {t("searchUser.empty")}
                        </Text>
                    ) : null
                }
                renderItem={({ item }) => (
                    <Pressable
                        className="flex-row items-center py-3"
                        onPress={() =>
                            router.push({
                                pathname: "/publicUserProfile",
                                params: {
                                    name: item.name,
                                    userName: item.userName,
                                    picture: item.image,
                                },
                            })
                        }
                    >
                        <Image
                            source={{ uri: item.image }}
                            className="h-14 w-14 rounded-full"
                            style={{ backgroundColor: c.bgMuted }}
                        />

                        <View className="ml-3 flex-1">
                            <Text
                                className="text-sm font-semibold"
                                style={{ color: c.text }}
                                numberOfLines={1}
                            >
                                {item.name}
                            </Text>

                            <Text
                                className="mt-0.5 text-xs"
                                style={{ color: c.textFaint }}
                                numberOfLines={1}
                            >
                                @{item.userName}
                            </Text>
                        </View>
                    </Pressable>
                )}
            />
        </View>
    );
}
