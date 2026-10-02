import { ReactNode } from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/context/colors';

interface ScreenContainerProps extends ScrollViewProps {
  children?: ReactNode;
}

export default function ScreenContainer({
  children,
  style,
  contentContainerStyle,
  ...props
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const c = useThemeColors();

  return (
    <ScrollView
      className="flex-1"
      style={[{ backgroundColor: c.bg }, style]}
      contentContainerClassName="flex-grow items-center"
      contentContainerStyle={[{ paddingBottom: insets.bottom + 96 }, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

export { ScreenContainer };
