import { ScreenContainer } from "@/components/ScreenContainer";
import { useAuth } from "@/context/authContext";
import { useThemeColors } from "@/context/colors";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { saveTokens } from "../lib/auth/storage";
import { login } from "../lib/http/auth/login";

export default function LoginScreen() {
  const { t } = useTranslation();
  const c = useThemeColors();
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");

    if (!email.includes("@")) {
      setError(t("login.errors.invalidEmail"));
      return;
    }
    if (password.length < 6) {
      setError(t("login.errors.shortPassword"));
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting login with:", email);
      const result = await login(email, password);

      console.log("Login result:", JSON.stringify(result));

      if (!result.ok) {
        console.log("Login failed: result.ok is false");
        setError(t("login.errors.invalidCredentials"));
        return;
      }

      if (!result.data.accessToken) {
        console.log("Login failed: no access token");
        setError(t("login.errors.generic"));
        return;
      }

      console.log("Saving tokens...");
      await saveTokens(result.data.accessToken, result.data.refreshToken || "");
      console.log("Tokens saved");

      // Pequeno delay para garantir que o token foi salvo
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log("Calling signIn...");
      signIn();

      // Outro delay para garantir que o estado de autenticação foi atualizado
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log("Navigating to home...");
      router.replace("/");
    } catch (error) {
      console.error("Login error:", error);
      setError(t("login.errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <View className="mt-[60px] mb-2 w-full px-4">
        <Text className="mb-1 text-[32px] font-bold" style={{ color: c.text }}>
          {t("login.title")}
        </Text>
        <Text
          className="mb-6 text-base"
          style={{ color: c.text, opacity: 0.7 }}
        >
          {t("login.subtitle")}
        </Text>

        <Text className="mb-1 text-sm font-medium" style={{ color: c.text }}>
          {t("login.email")}
        </Text>
        <TextInput
          className="mb-4 rounded-lg border border-gray-400 px-3 py-3 text-base"
          style={{ color: c.text }}
          value={email}
          onChangeText={setEmail}
          placeholder={t("login.emailPlaceholder")}
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
        />

        <Text className="mb-1 text-sm font-medium" style={{ color: c.text }}>
          {t("login.password")}
        </Text>
        <TextInput
          className="mb-2 rounded-lg border border-gray-400 px-3 py-3 text-base"
          style={{ color: c.text }}
          value={password}
          onChangeText={setPassword}
          placeholder={t("login.passwordPlaceholder")}
          placeholderTextColor="#9ca3af"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          onSubmitEditing={handleSubmit}
          returnKeyType="go"
        />

        {error !== "" && (
          <Text className="mb-2 text-sm text-red-600" accessibilityRole="alert">
            {error}
          </Text>
        )}

        <Pressable
          className="mt-4 items-center rounded-lg bg-blue-600 py-3"
          style={({ pressed }) => ({ opacity: pressed || loading ? 0.7 : 1 })}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-semibold text-white">
              {t("login.submit")}
            </Text>
          )}
        </Pressable>

        <View className="mt-6 flex-row items-center justify-center">
          <Text className="text-sm" style={{ color: c.text }}>
            Não tem uma conta?
          </Text>
          <Link href="/register" asChild>
            <Pressable>
              <Text className="ml-1 text-sm font-semibold text-blue-600">
                Cadastre-se
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScreenContainer>
  );
}
