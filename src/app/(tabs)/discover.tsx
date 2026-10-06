import { DiscoverBookCard } from "@/components/discoverBookCard";
import { useThemeColors } from "@/context/colors";
import { PAGE_SIZE, searchBooks } from "@/lib/http/books/searchbooks";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLUMNS = 3;
const PADDING = 16;
const GAP = 12;

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

function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function DiscoverScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const c = useThemeColors();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 400);

  // sorteado uma única vez, não a cada render
  const randomTerm = useMemo(
    () => DISCOVER_TERMS[Math.floor(Math.random() * DISCOVER_TERMS.length)],
    [],
  );
  const term = debouncedQuery || randomTerm;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["books", "search", term],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const result = await searchBooks(term, pageParam);
      if (!result.ok || !Array.isArray(result.data)) {
        throw new Error("Failed to fetch books");
      }
      return result.data;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length + 1,
    staleTime: 1000 * 60 * 5,
  });

  // junta as páginas e remove ids duplicados (APIs de busca costumam repetir itens)
  const books = useMemo(() => {
    const all = data?.pages.flat() ?? [];
    const seen = new Set<string>();
    return all.filter((b) => {
      if (!b?.id) return true;
      const id = String(b.id);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [data]);

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: c.bg }}>
      <View className="w-full px-4 pb-3" style={{ paddingTop: insets.top + 8 }}>
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

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={c.accent} />
        </View>
      ) : (
        <FlashList
          data={books}
          numColumns={COLUMNS}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: PADDING - GAP / 2,
            paddingBottom: insets.bottom + 96,
          }}
          keyExtractor={(item, index) =>
            item?.id ? String(item.id) : String(index)
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator color={c.accent} />
              </View>
            ) : null
          }
          renderItem={({ item: book }) => (
            <View style={{ flex: 1, padding: GAP / 2 }}>
              <DiscoverBookCard
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
            </View>
          )}
        />
      )}
    </View>
  );
}