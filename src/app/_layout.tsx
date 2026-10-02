import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "../../global.css";
import "../../i18next/i18next";

import Toast from 'react-native-toast-message';
import Menu from "../components/menu";
import { AuthProvider, useAuth } from "../context/authContext";
import { useThemeColors } from "../context/colors";
import { ThemeProvider } from "../context/ThemeContext";

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
          <Stack.Screen name="index" />
          <Stack.Screen name="bookInfo" />
          <Stack.Screen name="discover" />
          <Stack.Screen name="editProfile" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="publicUserProfile" />
          <Stack.Screen name="searchUser" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="userprofile" />
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
        <ThemedStack />
        <Menu />
        <Toast />
      </AuthProvider>
    </ThemeProvider>
  );
}
