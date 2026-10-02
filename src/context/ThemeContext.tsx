import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@app:theme";

function ThemeController({
  children,
  theme,
  setThemeState,
}: {
  children: ReactNode;
  theme: Theme;
  setThemeState: (theme: Theme) => void;
}) {
  const { setColorScheme } = useColorScheme();

  function setTheme(theme: Theme) {
    setThemeState(theme);
    setColorScheme(theme);

    // Salva no celular
    AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [isLoaded, setIsLoaded] = useState(false);

  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (savedTheme === "dark" || savedTheme === "light") {
          setThemeState(savedTheme);
          setColorScheme(savedTheme);
        }
      } finally {
        setIsLoaded(true);
      }
    }

    loadTheme();
  }, [setColorScheme]);

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeController theme={theme} setThemeState={setThemeState}>
      {children}
    </ThemeController>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}

export default ThemeContext;
