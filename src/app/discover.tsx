import { DiscoverBookCard } from "@/components/discoverBookCard";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useThemeColors } from "@/context/colors";
import { searchBooks } from "@/lib/http/books/searchbooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLUMNS = 3;
const PADDING = 16;
const GAP = 12;

export default function DiscoverScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const c = useThemeColors();

  const cardWidth = Math.floor(
    (width - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS,
  );

  const DISCOVER_TERMS = [
    "adventure",
    "fantasy",
    "mystery",
    "romance",
    "history",
    "science fiction",
    "biography",
    "thriller",
  ];

  useEffect(() => {
    let cancelled = false;

    const timeout = setTimeout(
      async () => {
        setLoading(true);
        try {
          const trimmed = query.trim();
          const term =
            trimmed ||
            DISCOVER_TERMS[Math.floor(Math.random() * DISCOVER_TERMS.length)];

          const result = await searchBooks(term);
          console.log(
            "term:",
            term,
            "result:",
            JSON.stringify(result).slice(0, 300),
          );
          if (cancelled) return;

          setBooks(result.ok && Array.isArray(result.data) ? result.data : []);
        } catch (error) {
          if (!cancelled) {
            console.error("Error fetching books:", error);
            setBooks([]);
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      },
      query ? 400 : 0,
    ); // debounce só ao digitar

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  return (
    <ScreenContainer>
      <View className="w-full px-4 pb-4" style={{ paddingTop: insets.top + 8 }}>
        <TextInput
          className="h-11 rounded-[10px] px-3.5 text-[15px]"
          style={{ backgroundColor: c.bgInput, color: c.text }}
          placeholder={t("discover.searchPlaceholder")}
          placeholderTextColor={c.textFaint}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          autoCorrect={false}
        />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={c.accent} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ backgroundColor: c.bg }}
          contentContainerClassName="flex-row flex-wrap gap-x-3 gap-y-5 px-4 pb-6"
        >
          {books.map((book) => (
            <DiscoverBookCard
              key={book.id}
              width={cardWidth}
              id={book.id}
              title={book.title}
              authors={book.authors}
              author={book.author}
              summary={book.summary}
              pages={book.pages}
              currentPage={book.currentPage}
              publisher={book.publisher}
              language={book.language}
              publishDate={book.publishDate}
              status={book.status}
              cover={book.cover}
            />
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
