import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Button, Image, Pressable, Text, View } from "react-native";

import defaultCover from "../../assets/images/cover.jpg";
import ProgressBar from "./progressBar";

type Props = {
  title: string;
  subtitle?: string;
  author: string;
  translatedStatus?: string;
  progress: number;
  currentPage: number;
  pages: number;
  cover?: string;
  isBookInShelf: boolean;
  onAddToShelf: () => void;
  addToListText: string;
  pagesProgressText: string;
  colors: any;
  onEditBook?: () => void;
  onDeleteFromShelf?: () => void;
};

export function BookHeader({
  title,
  subtitle,
  author,
  translatedStatus,
  progress,
  currentPage,
  pages,
  cover,
  isBookInShelf,
  onAddToShelf,
  addToListText,
  pagesProgressText,
  colors,
  onEditBook,
  onDeleteFromShelf,
}: Props) {
  const router = useRouter();
  const imageSource = cover ? { uri: cover } : defaultCover;

  return (
    <View className="flex-row gap-4">
      <Image
        source={imageSource}
        className="h-[165px] w-[110px] rounded-lg"
        style={{
          backgroundColor: colors.bgMuted,
        }}
        resizeMode="cover"
      />

      <View className="flex-1 gap-1">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </Pressable>

          <View className="flex-row items-center gap-2">
            {isBookInShelf && onEditBook && (
              <Pressable
                onPress={onEditBook}
                hitSlop={12}
                className="rounded-full p-2"
                style={{ backgroundColor: colors.bgMuted }}
              >
                <Ionicons name="pencil" size={18} color={colors.text} />
              </Pressable>
            )}

            {isBookInShelf && onDeleteFromShelf && (
              <Pressable
                onPress={onDeleteFromShelf}
                hitSlop={12}
                className="rounded-full p-2"
                style={{ backgroundColor: colors.bgMuted }}
              >
                <Ionicons name="trash-outline" size={22} color={colors.text} />
              </Pressable>
            )}
          </View>
        </View>

        <Text
          className="text-xl font-bold"
          style={{
            color: colors.text,
          }}
          numberOfLines={3}
        >
          {title}
        </Text>

        {Boolean(subtitle) && (
          <Text
            className="text-sm"
            style={{
              color: colors.textMuted,
            }}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        )}

        <Text
          className="text-sm"
          style={{
            color: colors.textMuted,
          }}
          numberOfLines={1}
        >
          {author}
        </Text>

        {Boolean(translatedStatus) && (
          <View
            className="mt-1 self-start rounded-full px-2.5 py-1"
            style={{
              backgroundColor: colors.bgMuted,
            }}
          >
            <Text
              className="text-xs font-semibold"
              style={{
                color: colors.text,
              }}
            >
              {translatedStatus}
            </Text>
          </View>
        )}

        <View className="mt-2 gap-1.5">
          <ProgressBar progress={progress} showPercent={false} />

          <Text
            className="text-xs"
            style={{
              color: colors.textFaint,
            }}
          >
            {pagesProgressText}
          </Text>
        </View>

        {!isBookInShelf && (
          <View className="mt-2">
            <Button title={addToListText} onPress={onAddToShelf} />
          </View>
        )}
      </View>
    </View>
  );
}
