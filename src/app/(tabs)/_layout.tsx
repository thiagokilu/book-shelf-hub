// app/(tabs)/_layout.tsx

import { Stack } from "expo-router";
import { View } from "react-native";
import Menu from "../../components/menu";
import { useAuth } from "../../context/authContext";

export default function TabsLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <View className="flex-1">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="bookInfo" />
        <Stack.Screen name="discover" />
        <Stack.Screen name="editProfile" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="publicUserProfile" />
        <Stack.Screen name="searchUser" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="userprofile" />
      </Stack>

      {isAuthenticated && <Menu />}
    </View>
  );
}
