import { useTheme } from "./ThemeContext";

/** Paleta de cores por tema */
export const COLORS = {
    dark: {
        bg: "#232323",
        bgCard: "#1e1e1e",
        bgInput: "#262626",
        bgMuted: "#2a2a2a",
        border: "#333333",
        borderMuted: "#3a3a3a",
        text: "#ffffff",
        textMuted: "#b5b5b5",
        textFaint: "#888888",
        textSub: "#d4d4d4",
        accent: "#7c9cff",
        navBg: "#000000",
        navBorder: "#333333",
        navIcon: "#8a8a8a",
        navIconActive: "#ffffff",
        statusBarStyle: "light" as const,
    },
    light: {
        bg: "#f5f5f5",
        bgCard: "#ffffff",
        bgInput: "#efefef",
        bgMuted: "#e8e8e8",
        border: "#dddddd",
        borderMuted: "#cccccc",
        text: "#111111",
        textMuted: "#555555",
        textFaint: "#888888",
        textSub: "#333333",
        accent: "#3a6bff",
        navBg: "#ffffff",
        navBorder: "#e0e0e0",
        navIcon: "#8a8a8a",
        navIconActive: "#111111",
        statusBarStyle: "dark" as const,
    },
} as const;

export type ThemeColors = (typeof COLORS)[keyof typeof COLORS];

/** Hook para acessar as cores do tema atual */
export function useThemeColors(): ThemeColors {
    const { theme } = useTheme();
    return COLORS[theme];
}
