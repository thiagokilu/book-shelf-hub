import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "../../global.css";
import "../../i18next/i18next";

import { UserProvider } from "@/context/userContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { AuthProvider, useAuth } from "../context/authContext";
import { useThemeColors } from "../context/colors";
import { ThemeProvider } from "../context/ThemeContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Optional: Configure global query options
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
      gcTime: 1000 * 60 * 10, // Keep data in memory for 10 minutes
    },
  },
});

function ThemedStack() {
  const c = useThemeColors();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <StatusBar style={c.statusBarStyle} />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: c.bg,
          },
        }}
      >
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>

        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
        <QueryClientProvider client={queryClient}>
          <ThemedStack />
        </QueryClientProvider>
        </UserProvider>
        <Toast />
      </AuthProvider>
    </ThemeProvider>
  );
}
