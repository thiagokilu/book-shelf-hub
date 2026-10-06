import { useThemeColors } from "@/context/colors";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

type Props = {
  width?: number;
  id?: string;
  title?: string;
  authors?: string[];
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
  id,
  title,
  authors,
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
        id: id || title,
      },
    });
  };

  const containerStyle = width ? { width } : { width: "100%" as const };

  return (
    <Pressable style={containerStyle} onPress={handlePress}>
      {cover ? (
        <Image
          source={{ uri: cover }}
          resizeMode="cover"
          className="w-full rounded-md"
          style={{
            aspectRatio: 2 / 3,
            backgroundColor: c.bgMuted,
          }}
        />
      ) : (
        <View
          className="w-full rounded-md items-center justify-center"
          style={{
            aspectRatio: 2 / 3,
            backgroundColor: c.bgMuted,
          }}
        >
          <Text style={{ color: c.textFaint, fontSize: 32 }}>?</Text>
        </View>
      )}
      <Text
        className="mt-2 text-[13px] font-semibold"
        style={{ color: c.text }}
        numberOfLines={2}
      >
        {title}
      </Text>
    </Pressable>
  );
}
