import { useThemeColors } from '@/context/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { usePathname, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const items = [
    { key: 'shelf', route: '/', icon: 'bookshelf', lib: 'mci' },
    { key: 'discover', route: '/discover', icon: 'compass', lib: 'fa' },
    { key: 'searchUser', route: '/searchUser', icon: 'users', lib: 'fa' },
    { key: 'settings', route: '/settings', icon: 'gear', lib: 'fa' },
] as const;

export default function Menu() {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();
    const c = useThemeColors();


    return (
        <View
            className="absolute inset-x-0 bottom-0 flex-row items-center justify-around pt-2.5"
            style={{
                backgroundColor: c.navBg,
                borderTopWidth: 1,
                borderTopColor: c.navBorder,
                paddingBottom: insets.bottom + 8,
            }}
        >
            {items.map((item) => {
                const isActive = pathname === item.route;
                const iconColor = isActive ? c.navIconActive : c.navIcon;
                const label = t(`nav.${item.key}`);
                return (
                    <TouchableOpacity
                        key={item.key}
                        className="flex-1 items-center gap-1"
                        activeOpacity={0.7}
                        onPress={() => router.push(item.route as any)}
                    >
                        {item.lib === 'mci' ? (
                            <MaterialCommunityIcons name={item.icon as any} size={24} color={iconColor} />
                        ) : (
                            <FontAwesome name={item.icon as any} size={24} color={iconColor} />
                        )}
                        <Text style={{ color: iconColor }} className={`text-xs ${isActive ? 'font-bold' : ''}`}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
