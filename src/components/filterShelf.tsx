import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useThemeColors } from "@/context/colors";
import { SelectField } from "./FilterShelf";
import { FORMAT_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS } from "./FilterShelf/constants";
import type { Book, ShelfFilters } from "./FilterShelf/types";
import { DEFAULT_FILTERS } from "./FilterShelf/types";
import { applyShelfFilters } from "./FilterShelf/utils";

// Re-export types for backward compatibility
export { DEFAULT_FILTERS } from "./FilterShelf/types";
export type { Book, BookFormat, ShelfFilters, SortKey, Status } from "./FilterShelf/types";
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
        <View className="gap-2.5">
            <Text className="text-base font-semibold" style={{ color: c.text }}>{label}</Text>
            <View className="flex-row flex-wrap gap-2">
                {options.map((opt) => {
                    const selected = opt.value === value;
                    return (
                        <Pressable
                            key={opt.value}
                            onPress={() => onSelect(opt.value)}
                            accessibilityRole="button"
                            accessibilityLabel={`${label}: ${opt.label}`}
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

export default function FilterShelf<T extends Book = Book>({ books, onChange }: Props<T>) {
    const { t } = useTranslation();
    const [filters, setFilters] = useState<ShelfFilters>(DEFAULT_FILTERS);
    const [draft, setDraft] = useState<ShelfFilters>(DEFAULT_FILTERS);
    const [open, setOpen] = useState(false);
    const c = useThemeColors();

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
        () => Array.from(new Set(books.flatMap((b) => b.tags))).sort(),
        [books]
    );

    const tagOptions = useMemo(
        () => [{ label: t("common.all"), value: "ALL" }, ...tags.map((t) => ({ label: t, value: t }))],
        [tags, t]
    );

    const countActive = (f: ShelfFilters) =>
        (Object.keys(DEFAULT_FILTERS) as (keyof ShelfFilters)[]).filter(
            (k) => f[k] !== DEFAULT_FILTERS[k]
        ).length;

    const resultCount = useMemo(() => applyShelfFilters(books, filters).length, [books, filters]);
    const draftCount = useMemo(() => applyShelfFilters(books, draft).length, [books, draft]);
    const activeCount = countActive(filters);
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
            {/* Barra compacta (sempre visível) */}
            <View
                className="my-2 min-h-[44px] w-full flex-row items-center justify-between rounded-xl px-3"
                style={{ borderWidth: 1, borderColor: c.border, backgroundColor: c.bgCard }}
            >
                <Text className="text-sm" style={{ color: c.textMuted }}>
                    {t("common.book", { count: resultCount })}
                </Text>

                <View className="flex-row items-center gap-1">
                    {activeCount > 0 && (
                        <Pressable
                            onPress={() => commit(DEFAULT_FILTERS)}
                            accessibilityRole="button"
                            accessibilityLabel={t("filters.clearFilters")}
                            hitSlop={8}
                            className="px-2 py-1.5 active:opacity-60"
                        >
                            <Text className="text-sm" style={{ color: c.accent }}>
                                {t("common.clear")}
                            </Text>
                        </Pressable>
                    )}

                    <Pressable
                        onPress={openSheet}
                        accessibilityRole="button"
                        accessibilityLabel={t("filters.openFilters")}
                        hitSlop={6}
                        className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5 active:opacity-70"
                        style={{
                            borderWidth: 1,
                            borderColor: activeCount > 0 ? c.accent : c.borderMuted,
                            backgroundColor: activeCount > 0 ? `${c.accent}26` : c.bgInput,
                        }}
                    >
                        <Text className="text-sm font-medium" style={{ color: c.text }}>
                            {t("filters.title")}
                        </Text>
                        {activeCount > 0 && (
                            <View className="h-[18px] min-w-[18px] items-center justify-center rounded-full px-1" style={{ backgroundColor: c.accent }}>
                                <Text className="text-[11px] font-bold text-white">
                                    {activeCount}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                </View>
            </View>

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
                        <View className="flex-row items-center justify-between px-5 pb-2 pt-3">
                            <Text className="text-xl font-bold" style={{ color: c.text }}>
                                {t("filters.title")}
                            </Text>
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
                                    {t("common.viewBook", { count: draftCount })}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}