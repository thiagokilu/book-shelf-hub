import { useThemeColors } from "@/context/colors";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, View } from "react-native";
import type { MockBook } from "../../mock/books";
import ProgressBar from "./progressBar";

export default function CardBook({
  id,
  title,
  author,
  pages,
  status,
  cover,
  currentPage,
  summary,
  publisher,
  publishDate,
  language,
  authors,
  subtitle,
  categories,
  isbn,
  infoLink,
  publishedYear,
  readingPercentage,
}: MockBook) {
  const { t } = useTranslation();
  const c = useThemeColors();
  const imageSource = cover
    ? { uri: cover }
    : require("../../assets/images/cover.jpg");
  const translatedStatus = t(`status.${status}`, { defaultValue: status });

  return (
    <Pressable
      className="my-2 mx-4 flex-row gap-3 p-3"
      onPress={() => {
        router.push({
          pathname: "/bookInfo",
          params: {
            book: JSON.stringify({
              id,
              title,
              author,
              authors,
              pages,
              status,
              currentPage,
              cover,
              summary,
              subtitle,
              publisher,
              publishDate,
              language,
              categories,
              isbn,
              infoLink,
              publishedYear,
              readingPercentage,
            }),
          },
        });
      }}
    >
      <Image
        source={imageSource}
        className="h-[120px] w-[80px] rounded-lg"
        style={{ backgroundColor: c.bgMuted }}
        resizeMode="cover"
      />

      <View className="flex-1 justify-center gap-1">
        <Text
          className="text-lg font-bold"
          style={{ color: c.text }}
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text
          className="text-sm"
          style={{ color: c.textMuted }}
          numberOfLines={1}
        >
          {author}
        </Text>

        <ProgressBar progress={pages > 0 ? currentPage / pages : 0} />

        <Text className="text-xs" style={{ color: c.textFaint }}>
          {t("common.page", { count: pages })}
        </Text>

        <View
          className="mt-1 self-start rounded-full px-2.5 py-1"
          style={{ backgroundColor: c.bgMuted }}
        >
          <Text className="text-xs font-semibold" style={{ color: c.text }}>
            {translatedStatus}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
