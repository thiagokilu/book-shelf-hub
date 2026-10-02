import { useThemeColors } from "@/context/colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import defaultCover from "../../assets/images/cover.jpg";

import ProgressBar from "../components/progressBar";

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

function cleanSummary(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/\s*\n\s*/g, " ")
    .trim();
}

function MetaRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: any;
}) {
  return (
    <Text className="text-[13px]" style={{ color: colors.textFaint }}>
      {label}: <Text style={{ color: colors.textSub }}>{value}</Text>
    </Text>
  );
}

export default function BookInfoScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{
    title?: string;
    author?: string;
    authors?: string;
    subtitle?: string;
    summary?: string;
    pages?: string;
    currentPage?: string;
    publisher?: string;
    language?: string;
    publishDate?: string;
    status?: string;
    cover?: string;
    categories?: string;
    isbn?: string;
    infoLink?: string;
    publishedYear?: string;
    readingPercentage?: string;
    book?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const c = useThemeColors();

  let bookParams: Record<string, string | number> = {};
  try {
    bookParams = params.book ? JSON.parse(params.book) : {};
  } catch {
    bookParams = {};
  }

  const title = String(bookParams.title ?? params.title ?? "");
  const authorsValue = bookParams.authors ?? params.authors ?? "";
  const authors = Array.isArray(authorsValue)
    ? authorsValue.map(String)
    : String(authorsValue)
        .split(",")
        .map((bookAuthor) => bookAuthor.trim())
        .filter(Boolean);
  const author =
    authors.join(", ") || String(bookParams.author ?? params.author ?? "");
  const subtitle = String(bookParams.subtitle ?? params.subtitle ?? "");
  const summary = String(bookParams.summary ?? params.summary ?? "");
  const pages = Number(bookParams.pages ?? params.pages ?? 0);
  const currentPage = Number(bookParams.currentPage ?? params.currentPage ?? 0);
  const publisher = String(bookParams.publisher ?? params.publisher ?? "");
  const language = String(bookParams.language ?? params.language ?? "");
  const publishDate = String(
    bookParams.publishDate ?? params.publishDate ?? "",
  );
  const publishedYear = Number(
    bookParams.publishedYear ?? params.publishedYear ?? 0,
  );
  const categoriesValue = bookParams.categories ?? params.categories ?? "";
  const categories = Array.isArray(categoriesValue)
    ? categoriesValue.map(String)
    : String(categoriesValue)
        .split(",")
        .map((category) => category.trim())
        .filter(Boolean);
  const isbn = String(bookParams.isbn ?? params.isbn ?? "");
  const infoLink = String(bookParams.infoLink ?? params.infoLink ?? "");
  const readingPercentage = Number(
    bookParams.readingPercentage ?? params.readingPercentage ?? 0,
  );
  const rawStatus = String(bookParams.status ?? params.status ?? "");
  const translatedStatus = rawStatus
    ? t(`status.${rawStatus}`, { defaultValue: rawStatus })
    : "";

  const [expanded, setExpanded] = useState(false);

  const progress = Math.min(
    1,
    Math.max(
      0,
      readingPercentage > 0
        ? readingPercentage / 100
        : pages > 0
          ? currentPage / pages
          : 0,
    ),
  );

  const cover = String(bookParams.cover ?? params.cover ?? "");
  const imageSource = cover ? { uri: cover } : defaultCover;
  const languageLabel = language
    ? t(`bookInfo.languages.${language.toLowerCase()}`, {
        defaultValue: language,
      })
    : "";

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: c.bg }}
        contentContainerClassName="gap-5 p-4"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 96,
        }}
      >
        <Pressable onPress={() => router.back()} hitSlop={12} className="mb-2">
          <Ionicons name="chevron-back" size={26} color={c.text} />
        </Pressable>
        <View className="flex-row gap-4">
          <Image
            source={imageSource}
            className="h-[165px] w-[110px] rounded-lg"
            style={{ backgroundColor: c.bgMuted }}
            resizeMode="cover"
          />

          <View className="flex-1 gap-1">
            <Text
              className="text-xl font-bold"
              style={{ color: c.text }}
              numberOfLines={3}
            >
              {title}
            </Text>
            {Boolean(subtitle) && (
              <Text
                className="text-sm"
                style={{ color: c.textMuted }}
                numberOfLines={2}
              >
                {subtitle}
              </Text>
            )}
            <Text
              className="text-sm"
              style={{ color: c.textMuted }}
              numberOfLines={1}
            >
              {author}
            </Text>

            {Boolean(translatedStatus) && (
              <View
                className="mt-1 self-start rounded-full px-2.5 py-1"
                style={{ backgroundColor: c.bgMuted }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: c.text }}
                >
                  {translatedStatus}
                </Text>
              </View>
            )}

            <View className="mt-2 gap-1.5">
              <ProgressBar progress={progress} showPercent={false} />
              <Text className="text-xs" style={{ color: c.textFaint }}>
                {t("bookInfo.pagesProgress", {
                  current: currentPage,
                  total: pages,
                  percent: Math.round(progress * 100),
                })}
              </Text>
            </View>
            <View>
              <Button title={t("bookInfo.addToList")} />
            </View>
          </View>
        </View>

        <View className="gap-1.5">
          <MetaRow
            label={t("bookInfo.publisher")}
            value={publisher}
            colors={c}
          />
          <MetaRow
            label={t("bookInfo.language")}
            value={languageLabel}
            colors={c}
          />
          <MetaRow
            label={t("bookInfo.publication")}
            value={formatDate(publishDate)}
            colors={c}
          />
          <MetaRow
            label={t("bookInfo.pages")}
            value={String(pages)}
            colors={c}
          />
          {publishedYear > 0 && (
            <MetaRow
              label={t("bookInfo.publishedYear")}
              value={String(publishedYear)}
              colors={c}
            />
          )}
          {Boolean(isbn) && (
            <MetaRow label={t("bookInfo.isbn")} value={isbn} colors={c} />
          )}
          {categories.length > 0 && (
            <MetaRow
              label={t("bookInfo.categories")}
              value={categories.join(", ")}
              colors={c}
            />
          )}
        </View>

        {Boolean(infoLink) && (
          <Pressable onPress={() => Linking.openURL(infoLink)} hitSlop={8}>
            <Text className="text-sm font-semibold" style={{ color: c.text }}>
              {t("bookInfo.viewOnGoogleBooks")}
            </Text>
          </Pressable>
        )}

        <View>
          <Text
            className="mb-1.5 text-base font-bold"
            style={{ color: c.text }}
          >
            {t("bookInfo.summary")}
          </Text>
          <Text
            className="text-sm leading-[21px]"
            style={{ color: c.textMuted }}
            numberOfLines={expanded ? undefined : 3}
          >
            {cleanSummary(summary)}
          </Text>
          <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={8}>
            <Text
              className="mt-1.5 text-[13px] font-semibold"
              style={{ color: c.text }}
            >
              {expanded ? t("common.showLess") : t("common.showMore")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}
