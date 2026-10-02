import { useMemo } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { SelectField } from "../SelectField";
import type { Book, ShelfFilters } from "../types";

type TagFilterProps = {
    books: Book[];
    filters: ShelfFilters;
    onChange: (tag: string) => void;
};

type SelectOption<T> = {
    label: string;
    value: T;
};

export default function TagFilter({ books, filters, onChange }: TagFilterProps) {
    const { t } = useTranslation();
    // Tags disponíveis, extraídas dos próprios livros
    const tags = useMemo(
        () => Array.from(new Set(books.flatMap((b) => b.tags))).sort(),
        [books]
    );

    const tagOptions = useMemo<SelectOption<string>[]>(
        () => [{ label: t("common.all"), value: "ALL" }, ...tags.map((t) => ({ label: t, value: t }))],
        [tags, t]
    );

    return (
        <View className="flex-1">
            <SelectField
                label={t("filters.genreTag")}
                value={filters.tag}
                options={tagOptions}
                onSelect={onChange}
            />
        </View>
    );
}