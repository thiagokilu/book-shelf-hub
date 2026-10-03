import { Text, View } from "react-native";

type MetaItem = {
  label: string;
  value: string;
};

type Props = {
  meta: MetaItem[];
  colors: any;
};

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

export function BookMeta({ meta, colors }: Props) {
  return (
    <View className="gap-1.5">
      {meta.map((item, index) => (
        <MetaRow key={index} label={item.label} value={item.value} colors={colors} />
      ))}
    </View>
  );
}
