import { useThemeColors } from "@/context/colors";
import { useEffect } from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

type SkeletonProps = {
    width?: ViewStyle["width"];
    height?: ViewStyle["height"];
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
};

export default function Skeleton({
    width = "100%",
    height = 16,
    borderRadius = 6,
    style,
}: SkeletonProps) {
    const c = useThemeColors();
    const opacity = useSharedValue(1);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
            -1,
            true,
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (

        <Animated.View
            style={[
                { width, height, borderRadius, backgroundColor: c.bgMuted },
                animatedStyle,
                style,
            ]}
        />
    );
}