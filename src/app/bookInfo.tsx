import { ScreenContainer } from "@/components/ScreenContainer";
import { useThemeColors } from "@/context/colors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { BookHeader } from "@/components/BookHeader";
import { BookMeta } from "@/components/BookMeta";
import { BookSummary } from "@/components/BookSummary";
import EditBookModal from "@/components/EditBookModal";
import RemoveBookModal from "@/components/RemoveBookModal";

import { AddBookToShelf } from "../lib/http/books/addbookto-shelf";
import { editBookInfo } from "../lib/http/books/editbookinfo";
import { findBookById } from "../lib/http/books/findBookById";
import { RemoveBookFromShelf } from "../lib/http/books/removebookfromshelf";
import { showBookShelf } from "../lib/http/books/showbookshelf";
import type { Book } from "../lib/models/book";

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");

  return y && m && d ? `${d}/${m}/${y}` : iso;
}

export default function BookInfoScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();

  const insets = useSafeAreaInsets();
  const c = useThemeColors();

  const [expanded, setExpanded] = useState(false);
  const [isBookInShelf, setIsBookInShelf] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const bookId = params.id;

  useEffect(() => {
    const loadBookFromShelf = async () => {
      if (!bookId) return;

      try {
        const result = await showBookShelf();

        if (!result.ok) {
          setLoading(false);
          return;
        }

        const books = result.data;
        const foundBook = books.find(
          (book) => String(book.id) === String(bookId),
        );

        if (foundBook) {
          setIsBookInShelf(true);
          setCurrentBook({
            id: foundBook.id,
            title: foundBook.title,
            authors: foundBook.authors || [foundBook.author].filter(Boolean),
            subtitle: foundBook.subtitle,
            coverUrl: foundBook.cover,
            description: foundBook.summary,
            publisher: foundBook.publisher,
            language: foundBook.language,
            publishedDate: foundBook.publishDate,
            publishedYear: foundBook.publishedYear,
            categories: foundBook.categories,
            isbn: foundBook.isbn,
            infoLink: foundBook.infoLink,
            pageCount: foundBook.pages,
            currentPage: foundBook.currentPage,
            status: (foundBook.status === "ALL" || !foundBook.status) ? "WANT_TO_READ" : foundBook.status,
            readingPercentage:
              foundBook.readingPercentage || foundBook.progress,
            updatedAt: foundBook.updatedAt,
            tags: foundBook.tags,
            format: foundBook.format,
          });
        } else {
          // If not in shelf, try to fetch from API by ID
          const apiResult = await findBookById(bookId);
          if (apiResult.ok && apiResult.data) {
            setCurrentBook({
              id: apiResult.data.id,
              title: apiResult.data.title,
              authors: apiResult.data.authors || [],
              subtitle: undefined,
              coverUrl: apiResult.data.coverUrl,
              description: apiResult.data.description,
              publisher: apiResult.data.publisher || "",
              language: apiResult.data.language || "",
              publishedDate: apiResult.data.publishedDate || "",
              publishedYear: apiResult.data.publishedYear,
              categories: apiResult.data.categories || [],
              isbn: apiResult.data.isbn || "",
              infoLink: apiResult.data.infoLink || "",
              pageCount: apiResult.data.pageCount || 0,
              currentPage: 0,
              status: "WANT_TO_READ",
              readingPercentage: 0,
              updatedAt: undefined,
              tags: [],
              format: "PHYSICAL",
            });
          }
        }
      } catch (error) {
        // Error loading book
      } finally {
        setLoading(false);
      }
    };

    loadBookFromShelf();
  }, [bookId]);

  async function handleAddBookToShelf(book: Book) {
    try {
      if (!book.id || !book.title || book.authors.length === 0) {
        throw new Error(
          "Book ID, title, and author are required to add to shelf.",
        );
      }

      await AddBookToShelf(book);

      setIsBookInShelf(true);
      setCurrentBook(book);

      Toast.show({
        type: "success",
        text1: t("notifications.bookAdded"),
        text2: t("notifications.bookAddedMessage"),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      Toast.show({
        type: "error",
        text1: t("notifications.addBookError"),
        text2: message,
      });
    }
  }

  const handleSaveEdit = async (
    status: "WANT_TO_READ" | "READING" | "COMPLETED",
    currentPage: number,
  ) => {
    if (!currentBook) return;

    try {
      const updatedData = {
        status,
        currentPage,
        readingPercentage: currentBook.pageCount
          ? (currentPage / currentBook.pageCount) * 100
          : 0,
      };

      await editBookInfo(currentBook.id, status, currentPage);
      setCurrentBook({
        ...currentBook,
        ...updatedData,
      });
      Toast.show({
        type: "success",
        text1: t("notifications.bookUpdated"),
        text2: t("notifications.bookUpdatedMessage"),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      Toast.show({
        type: "error",
        text1: t("notifications.updateBookError"),
        text2: message,
      });
    }
  };

  const handleRemoveBook = async () => {
    try {
      if (!currentBook) return;
      await RemoveBookFromShelf(currentBook.id);
      setRemoveModalVisible(false);
      setIsBookInShelf(false);
      setCurrentBook(null);
      router.back();
      Toast.show({
        type: "success",
        text1: t("notifications.bookRemoved"),
        text2: t("notifications.bookRemovedMessage"),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      Toast.show({
        type: "error",
        text1: t("notifications.removeBookError"),
        text2: message,
      });
    }
  };

  if (loading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center" style={{ backgroundColor: c.bg }}>
          <ActivityIndicator size="large" color={c.text} />
        </View>
      </ScreenContainer>
    );
  }

  if (!currentBook) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center p-4" style={{ backgroundColor: c.bg }}>
          <Text style={{ color: c.text }}>{t("bookInfo.bookNotFound")}</Text>
        </View>
      </ScreenContainer>
    );
  }

  const title = currentBook.title;
  const subtitle = currentBook.subtitle || "";
  const authors = currentBook.authors;
  const author = authors[0] || "";
  const summary = currentBook.description || "";
  const pages = currentBook.pageCount || 0;
  const currentPage = currentBook.currentPage || 0;
  const publisher = currentBook.publisher || "";
  const language = currentBook.language || "";
  const publishDate = currentBook.publishedDate || "";
  const publishedYear = currentBook.publishedYear || 0;
  const categories = currentBook.categories || [];
  const isbn = currentBook.isbn || "";
  const infoLink = currentBook.infoLink || "";
  const cover = currentBook.coverUrl || "";
  const readingPercentage = currentBook.readingPercentage || 0;
  const displayedStatus = currentBook.status;
  const displayedCurrentPage = currentPage;
  const displayedReadingPercentage = readingPercentage;

  const translatedStatus = displayedStatus
    ? t(`status.${displayedStatus}`, {
        defaultValue: displayedStatus,
      })
    : "";

  const progress = Math.min(
    1,
    Math.max(
      0,
      displayedReadingPercentage > 0
        ? displayedReadingPercentage / 100
        : pages > 0
          ? displayedCurrentPage / pages
          : 0,
    ),
  );

  const languageLabel = language
    ? t(`bookInfo.languages.${language.toLowerCase()}`, {
        defaultValue: language,
      })
    : "";

  const metaItems = [
    { label: t("bookInfo.publisher"), value: publisher },
    { label: t("bookInfo.language"), value: languageLabel },
    { label: t("bookInfo.publication"), value: formatDate(publishDate) },
    { label: t("bookInfo.pages"), value: String(pages) },
    ...(publishedYear > 0
      ? [{ label: t("bookInfo.publishedYear"), value: String(publishedYear) }]
      : []),
    ...(isbn ? [{ label: t("bookInfo.isbn"), value: isbn }] : []),
    ...(categories.length > 0
      ? [{ label: t("bookInfo.categories"), value: categories.join(", ") }]
      : []),
  ];

  const bookToAdd: Book = {
    id: currentBook.id,
    title: currentBook.title,
    authors: currentBook.authors,
    subtitle: currentBook.subtitle,
    coverUrl: currentBook.coverUrl,
    description: currentBook.description,
    publisher: currentBook.publisher,
    language: currentBook.language,
    publishedDate: currentBook.publishedDate,
    publishedYear: currentBook.publishedYear,
    categories: currentBook.categories,
    isbn: currentBook.isbn,
    infoLink: currentBook.infoLink,
    pageCount: currentBook.pageCount,
    currentPage: currentBook.currentPage,
    readingPercentage: currentBook.readingPercentage,
    status: "WANT_TO_READ",
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: c.bg,
        }}
        contentContainerClassName="gap-5 p-4"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 96,
        }}
      >
        <BookHeader
          title={title}
          subtitle={subtitle}
          author={author}
          translatedStatus={translatedStatus}
          progress={progress}
          currentPage={currentPage}
          pages={pages}
          cover={cover}
          isBookInShelf={isBookInShelf}
          onAddToShelf={() => handleAddBookToShelf(bookToAdd)}
          addToListText={t("bookInfo.addToList")}
          pagesProgressText={t("bookInfo.pagesProgress", {
            current: displayedCurrentPage,
            total: pages,
            percent: Math.round(progress * 100),
          })}
          colors={c}
          onEditBook={() => setEditModalVisible(true)}
          onDeleteFromShelf={() => setRemoveModalVisible(true)}
        />

        <BookMeta meta={metaItems} colors={c} />

        {Boolean(infoLink) && (
          <Pressable onPress={() => Linking.openURL(infoLink)} hitSlop={8}>
            <Text
              className="text-sm font-semibold"
              style={{
                color: c.text,
              }}
            >
              {t("bookInfo.viewOnGoogleBooks")}
            </Text>
          </Pressable>
        )}

        <BookSummary
          summary={summary}
          expanded={expanded}
          onToggle={() => setExpanded((v) => !v)}
          summaryLabel={t("bookInfo.summary")}
          showMoreText={t("common.showMore")}
          showLessText={t("common.showLess")}
          colors={c}
        />
      </ScrollView>

      {currentBook && (
        <EditBookModal
          visible={editModalVisible}
          status={(currentBook.status === "ALL" || !currentBook.status) ? "WANT_TO_READ" : currentBook.status}
          currentPage={currentBook.currentPage || 0}
          totalPages={currentBook.pageCount || 0}
          onClose={() => setEditModalVisible(false)}
          onSave={handleSaveEdit}
        />
      )}

      <RemoveBookModal
        visible={removeModalVisible}
        onClose={() => setRemoveModalVisible(false)}
        onConfirm={handleRemoveBook}
      />
    </>
  );
}
