import { useThemeColors } from '@/context/colors';
import { Text, View } from 'react-native';

type ProgressBarProps = {
    progress: number; // de 0 a 1
    height?: number;
    color?: string;
    trackColor?: string;
    showPercent?: boolean;
};

export default function ProgressBar({
    progress,
    height = 4,
    color,
    trackColor,
    showPercent = true,
}: ProgressBarProps) {
    const c = useThemeColors();
    const percent = Math.min(Math.max(progress, 0), 1) * 100;

    return (
        <View className="flex-row items-center gap-2">
            <View
                style={[
                    { flex: 1, overflow: 'hidden' },
                    { height, borderRadius: height / 2, backgroundColor: trackColor || c.bgMuted },
                ]}
            >
                <View
                    style={{
                        width: `${percent}%`,
                        height: '100%',
                        borderRadius: height / 2,
                        backgroundColor: color || c.accent,
                    }}
                />
            </View>

            {showPercent && (
                <Text className="min-w-8 text-right text-xs" style={{ color: c.text }}>{percent.toFixed(0)}%</Text>
            )}
        </View>
    );
}
