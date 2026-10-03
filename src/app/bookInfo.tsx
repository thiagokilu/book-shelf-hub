import { useThemeColors } from "@/context/colors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { BookHeader } from "@/components/BookHeader";
import { BookMeta } from "@/components/BookMeta";
import { BookSummary } from "@/components/BookSummary";
import EditBookModal from "@/components/EditBookModal";
import RemoveBookModal from "@/components/RemoveBookModal";

import { AddBookToShelf } from "../lib/http/books/addbookto-shelf";
import { editBookInfo } from "../lib/http/books/editbookinfo";
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
  const params = useLocalSearchParams<{
    title?: string;
    id?: string;
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

  const insets = useSafeAreaInsets();
  const c = useThemeColors();

  const [expanded, setExpanded] = useState(false);
  const [isBookInShelf, setIsBookInShelf] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);

  let bookParams: Record<string, any> = {};

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

  const author = String(bookParams.author ?? params.author ?? "").trim();
  const normalizedAuthors =
    authors.length > 0 ? authors : author ? [author] : [];

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

  const bookId = String(bookParams.id ?? params.id ?? isbn ?? title);

  const infoLink = String(bookParams.infoLink ?? params.infoLink ?? "");

  const readingPercentage = Number(
    bookParams.readingPercentage ?? params.readingPercentage ?? 0,
  );

  const rawStatus = String(bookParams.status ?? params.status ?? "");
  const displayedStatus = currentBook?.status ?? rawStatus;
  const displayedCurrentPage = currentBook?.currentPage ?? currentPage;
  const displayedReadingPercentage =
    currentBook?.readingPercentage ?? readingPercentage;

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

  const cover = String(bookParams.cover ?? params.cover ?? "");

  const bookToAdd: Book = {
    id: bookId,
    title,
    authors: normalizedAuthors,
    subtitle: subtitle || undefined,
    coverUrl: cover || undefined,
    description: summary || undefined,
    publisher: publisher || undefined,
    language: language || undefined,
    publishedDate: publishDate || undefined,
    publishedYear: publishedYear || undefined,
    categories: categories.length > 0 ? categories : undefined,
    isbn: isbn || undefined,
    infoLink: infoLink || undefined,
    pageCount: pages || undefined,
    currentPage,
    readingPercentage,
    status: "WANT_TO_READ",
  };

  const languageLabel = language
    ? t(`bookInfo.languages.${language.toLowerCase()}`, {
        defaultValue: language,
      })
    : "";

  // Verifica se o livro já está na bookshelf e carrega dados
  useEffect(() => {
    const checkBookInShelf = async () => {
      try {
        const result = await showBookShelf();

        if (!result.ok) {
          return;
        }

        const books = result.data;

        const exists = books.some(
          (book) => String(book.id) === String(bookToAdd.id),
        );

        setIsBookInShelf(exists);

        if (exists) {
          const foundBook = books.find(
            (book) => String(book.id) === String(bookToAdd.id),
          );
          if (foundBook) {
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
              status:
                foundBook.status === "ALL" ? "WANT_TO_READ" : foundBook.status,
              readingPercentage:
                foundBook.readingPercentage || foundBook.progress,
              updatedAt: foundBook.updatedAt,
              tags: foundBook.tags,
              format: foundBook.format,
            });
          }
        }
      } catch (error) {
        console.error("Error checking bookshelf:", error);
      }
    };

    checkBookInShelf();
  }, [bookToAdd.id]);

  async function handleAddBookToShelf(book: Book) {
    try {
      if (!book.id || !book.title || book.authors.length === 0) {
        throw new Error(
          "Book ID, title, and author are required to add to shelf.",
        );
      }

      await AddBookToShelf(book);

      // Depois de adicionar, esconde o botão
      setIsBookInShelf(true);

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
      await RemoveBookFromShelf(bookId);
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
          status={currentBook.status || "WANT_TO_READ"}
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
