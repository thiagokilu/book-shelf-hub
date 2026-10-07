import Skeleton from "@/components/Skeleton";
import { type StyleProp, View, type ViewStyle } from "react-native";

type ProfileSkeletonProps = {
  style?: StyleProp<ViewStyle>;
};

export default function ProfileSkeleton({ style }: ProfileSkeletonProps) {
  return (
    <View className="w-full gap-8 px-4" style={style}>
      <View className="items-center">
        <Skeleton
          width={100}
          height={100}
          borderRadius={50}
          style={{ marginBottom: 12 }}
        />
        <Skeleton width="42%" height={18} borderRadius={4} />
        <Skeleton
          width="30%"
          height={14}
          borderRadius={4}
          style={{ marginTop: 6 }}
        />
        <Skeleton
          width="75%"
          height={14}
          borderRadius={4}
          style={{ marginTop: 14 }}
        />
      </View>

      <View className="gap-3">
        <Skeleton
          width="38%"
          height={18}
          borderRadius={4}
          style={{ marginHorizontal: 16 }}
        />
        <View className="flex-row gap-3 px-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} width={100} height={150} borderRadius={8} />
          ))}
        </View>
      </View>
    </View>
  );
}
