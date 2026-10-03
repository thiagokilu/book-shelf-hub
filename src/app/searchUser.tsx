import { useThemeColors } from "@/context/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchUsers } from "../lib/http/user/SearchUsers";

type User = {
  id: string;
  username: string;
};

export default function SearchUserScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const insets = useSafeAreaInsets();
  const c = useThemeColors();
  const [users, setUsers] = useState<User[]>([]);
  const showEmpty = query.trim() !== "" && users.length === 0;

  const handleSearchUsers = async (text: string) => {
    setQuery(text);

    if (!text.trim()) {
      setUsers([]);
      return;
    }

    try {
      const response = await SearchUsers(text.trim());
      console.log('Search response:', response);
      if (response.ok) {
        console.log('Setting users:', response.data.users);
        setUsers(response.data.users || []);
      } else {
        console.log('Response not ok, clearing users');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setUsers([]);
    }
  };

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
          <View className="pb-4" style={{ paddingTop: insets.top + 8 }}>
            <TextInput
              className="h-11 w-full rounded-[10px] px-3.5 text-[15px]"
              style={{ backgroundColor: c.bgInput, color: c.text }}
              placeholder={t("searchUser.searchPlaceholder")}
              placeholderTextColor={c.textFaint}
              value={query}
              onChangeText={handleSearchUsers}
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
                  userName: item.username,
                },
              })
            }
          >
            <View
              className="h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: c.bgMuted }}
            >
              <FontAwesome name="user" size={24} color={c.textMuted} />
            </View>

            <View className="ml-3 flex-1">
              <Text
                className="text-sm font-semibold"
                style={{ color: c.text }}
                numberOfLines={1}
              >
                {item.username}
              </Text>

              <Text
                className="mt-0.5 text-xs"
                style={{ color: c.textFaint }}
                numberOfLines={1}
              >
                @{item.username}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
