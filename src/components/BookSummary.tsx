import { Pressable, Text, View } from "react-native";

type Props = {
  summary: string;
  expanded: boolean;
  onToggle: () => void;
  summaryLabel: string;
  showMoreText: string;
  showLessText: string;
  colors: any;
};

function cleanSummary(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/\s*\n\s*/g, " ")
    .trim();
}

export function BookSummary({
  summary,
  expanded,
  onToggle,
  summaryLabel,
  showMoreText,
  showLessText,
  colors,
}: Props) {
  return (
    <View>
      <Text
        className="mb-1.5 text-base font-bold"
        style={{
          color: colors.text,
        }}
      >
        {summaryLabel}
      </Text>

      <Text
        className="text-sm leading-[21px]"
        style={{
          color: colors.textMuted,
        }}
        numberOfLines={expanded ? undefined : 3}
      >
        {cleanSummary(summary)}
      </Text>

      <Pressable onPress={onToggle} hitSlop={8}>
        <Text
          className="mt-1.5 text-[13px] font-semibold"
          style={{
            color: colors.text,
          }}
        >
          {expanded ? showLessText : showMoreText}
        </Text>
      </Pressable>
    </View>
  );
}
