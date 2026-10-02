import { View } from "react-native";

import type { Book, ShelfFilters } from "../types";
import StatusFilter from "./StatusFilter";
import FormatFilter from "./FormatFilter";
import SortFilter from "./SortFilter";
import TagFilter from "./TagFilter";

type FilterModalProps = {
    books: Book[];
    filters: ShelfFilters;
    onChange: (key: keyof ShelfFilters, value: ShelfFilters[keyof ShelfFilters]) => void;
};

export default function FilterModal({ books, filters, onChange }: FilterModalProps) {
    return (
        <View className="gap-4">
            <View className="flex-row gap-2.5">
                <View className="flex-1">
                    <StatusFilter
                        value={filters.status}
                        onChange={(status) => onChange("status", status)}
                    />
                </View>
                <View className="flex-1">
                    <FormatFilter
                        value={filters.format}
                        onChange={(format) => onChange("format", format)}
                    />
                </View>
            </View>

            <View className="flex-row gap-2.5">
                <TagFilter
                    books={books}
                    filters={filters}
                    onChange={(tag) => onChange("tag", tag)}
                />
                <View className="flex-1">
                    <SortFilter
                        value={filters.sort}
                        onChange={(sort) => onChange("sort", sort)}
                    />
                </View>
            </View>
        </View>
    );
}
