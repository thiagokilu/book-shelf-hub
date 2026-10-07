import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { useThemeColors } from "@/context/colors";
import type { Book } from "@/lib/models/book";
import { SelectField } from "./FilterShelf";
import { FORMAT_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS } from "./FilterShelf/constants";
import type { ShelfFilters } from "./FilterShelf/types";
import { DEFAULT_FILTERS } from "./FilterShelf/types";
import { applyShelfFilters } from "./FilterShelf/utils";

// Re-export types for backward compatibility
export type { Book, BookFormat, Status } from "@/lib/models/book";
export { DEFAULT_FILTERS } from "./FilterShelf/types";
export type { ShelfFilters, SortKey } from "./FilterShelf/types";
export { applyShelfFilters } from "./FilterShelf/utils";

type Props<T extends Book = Book> = {
    books: T[];
    onChange?: (filters: ShelfFilters, result: T[]) => void;
};

type ChipOption<V extends string> = { label: string; value: V };

function ChipGroup<V extends string>({
    label,
    value,
    options,
    onSelect,
}: {
    label: string;
    value: V;
    options: readonly ChipOption<V>[];
    onSelect: (v: V) => void;
}) {
    const c = useThemeColors();
    return (
        <View className={label ? "gap-2.5 w-full" : "w-full"}>
            {label && <Text className="text-base font-semibold" style={{ color: c.text }}>{label}</Text>}
            <View className="flex-row flex-wrap gap-2 w-full">
                {options.map((opt) => {
                    const selected = opt.value === value;
                    return (
                        <Pressable
                            key={opt.value}
                            onPress={() => onSelect(opt.value)}
                            accessibilityRole="button"
                            accessibilityLabel={label ? `${label}: ${opt.label}` : opt.label}
                            accessibilityState={{ selected }}
                            className="min-h-[40px] justify-center rounded-full border px-4 active:opacity-70"
                            style={{
                                borderColor: selected ? c.accent : c.borderMuted,
                                backgroundColor: selected ? c.accent : c.bgInput,
                            }}
                        >
                            <Text
                                className="text-sm"
                                style={{
                                    fontWeight: selected ? "600" : "400",
                                    color: selected ? "#ffffff" : c.textSub,
                                }}
                            >
                                {opt.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

export interface FilterShelfRef {
    openSheet: () => void;
}

const FilterShelf = forwardRef<FilterShelfRef, Props<Book>>(function FilterShelf<T extends Book = Book>({ books, onChange }: Props<T>, ref: React.Ref<FilterShelfRef>) {
    const { t } = useTranslation();
    const [filters, setFilters] = useState<ShelfFilters>(DEFAULT_FILTERS);
    const [draft, setDraft] = useState<ShelfFilters>(DEFAULT_FILTERS);
    const [open, setOpen] = useState(false);
    const c = useThemeColors();

    useImperativeHandle(ref, () => ({
        openSheet,
    }));

    const statusOptions = useMemo(
        () => STATUS_OPTIONS.map((opt) => ({ ...opt, label: t(`filters.statusOptions.${opt.value}`) })),
        [t]
    );

    const formatOptions = useMemo(
        () => FORMAT_OPTIONS.map((opt) => ({ ...opt, label: t(`filters.formatOptions.${opt.value}`) })),
        [t]
    );

    const sortOptions = useMemo(
        () => SORT_OPTIONS.map((opt) => ({ ...opt, label: t(`filters.sortOptions.${opt.value}`) })),
        [t]
    );

    const tags = useMemo(
        () => Array.from(new Set(books.flatMap((b) => b.tags || []))).sort(),
        [books]
    );

    const tagOptions = useMemo(
        () => [{ label: t("common.all"), value: "ALL" }, ...tags.map((t) => ({ label: t, value: t as string }))],
        [tags, t]
    );

    const countActive = (f: ShelfFilters) =>
        (Object.keys(DEFAULT_FILTERS) as (keyof ShelfFilters)[])
            .filter((k) => f[k] !== DEFAULT_FILTERS[k])
            .length;

    const resultCount = useMemo(() => applyShelfFilters(books, filters).length, [books, filters]);
    const draftCount = useMemo(() => applyShelfFilters(books, draft).length, [books, draft]);
    const draftActive = countActive(draft);

    function commit(next: ShelfFilters) {
        setFilters(next);
        onChange?.(next, applyShelfFilters(books, next));
    }

    function openSheet() {
        setDraft(filters);
        setOpen(true);
    }

    function updateDraft<K extends keyof ShelfFilters>(key: K, value: ShelfFilters[K]) {
        setDraft((d) => ({ ...d, [key]: value }));
    }

    function apply() {
        commit(draft);
        setOpen(false);
    }

    return (
        <>
            {/* Modal sobreposto (bottom sheet) */}
            <Modal
                visible={open}
                transparent
                animationType="slide"
                onRequestClose={() => setOpen(false)}
                statusBarTranslucent
            >
                <View className="flex-1 justify-end">
                    {/* Fundo escurecido */}
                    <Pressable
                        className="absolute inset-0 bg-black/60"
                        onPress={() => setOpen(false)}
                        accessibilityLabel={t("filters.closeFilters")}
                    />

                    <View
                        className="max-h-[85%] rounded-t-3xl"
                        style={{ borderTopWidth: 1, borderTopColor: c.border, backgroundColor: c.bgCard }}
                    >
                        {/* Alça */}
                        <View className="items-center pt-2.5">
                            <View className="h-1 w-10 rounded-full" style={{ backgroundColor: c.borderMuted }} />
                        </View>

                        {/* Cabeçalho */}
                        <View className="px-5 pb-2 pt-3">
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text className="text-xl font-bold" style={{ color: c.text }}>
                                        {t("filters.title")}
                                    </Text>
                                    <Text className="text-sm" style={{ color: c.textMuted }}>
                                        {t("common.book", { count: draftCount })}
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    {draftActive > 0 && (
                                        <Pressable
                                            onPress={() => setDraft(DEFAULT_FILTERS)}
                                            accessibilityRole="button"
                                            hitSlop={8}
                                            className="px-2 py-1.5 active:opacity-60"
                                        >
                                            <Text className="text-sm font-medium" style={{ color: c.accent }}>
                                                {t("common.clear")}
                                            </Text>
                                        </Pressable>
                                    )}
                                    <Pressable
                                        onPress={() => setOpen(false)}
                                        accessibilityRole="button"
                                        accessibilityLabel={t("common.close")}
                                        hitSlop={8}
                                        className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
                                        style={{ backgroundColor: c.bgMuted }}
                                    >
                                        <Text className="text-base" style={{ color: c.textSub }}>✕</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>

                        {/* Conteúdo rolável */}
                        <ScrollView
                            contentContainerClassName="gap-6 px-5 py-4"
                            showsVerticalScrollIndicator={false}
                        >
                            <ChipGroup
                                label={t("filters.status")}
                                value={draft.status}
                                options={statusOptions}
                                onSelect={(v) => updateDraft("status", v)}
                            />
                            <ChipGroup
                                label={t("filters.format")}
                                value={draft.format}
                                options={formatOptions}
                                onSelect={(v) => updateDraft("format", v)}
                            />
                            <ChipGroup
                                label={t("filters.sortBy")}
                                value={draft.sort}
                                options={sortOptions}
                                onSelect={(v) => updateDraft("sort", v)}
                            />
                            <SelectField
                                label={t("filters.genreTag")}
                                value={draft.tag}
                                options={tagOptions}
                                onSelect={(v) => updateDraft("tag", v)}
                            />
                        </ScrollView>

                        {/* Botão fixo de aplicar */}
                        <View className="px-5 pb-8 pt-3" style={{ borderTopWidth: 1, borderTopColor: c.border }}>
                            <Pressable
                                onPress={apply}
                                accessibilityRole="button"
                                className="h-12 items-center justify-center rounded-xl active:opacity-80"
                                style={{ backgroundColor: c.accent }}
                            >
                                <Text className="text-base font-semibold text-white">
                                    {t("common.apply")}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
});

export default FilterShelf;