import { ScreenContainer } from "@/components/ScreenContainer";
import { useAuth } from "@/context/authContext";
import { useThemeColors } from "@/context/colors";
import { useMutation } from "@tanstack/react-query";
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
  const [validationError, setValidationError] = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      const result = await login(email, password);
      if (!result.ok) throw new Error("invalidCredentials");
      if (!result.data.accessToken) throw new Error("generic");
      return result.data;
    },
    onSuccess: async (data) => {
      await saveTokens(data.accessToken ?? "", data.refreshToken ?? "");
      signIn();
      router.replace("/" as const);
    },
  });

  const apiErrorKey =
    loginMutation.error?.message === "invalidCredentials"
      ? "login.errors.invalidCredentials"
      : "login.errors.generic";
  const apiError = loginMutation.isError ? t(apiErrorKey) : "";

  const displayError = validationError || apiError;
  const loading = loginMutation.isPending;

  function handleSubmit() {
    setValidationError("");
    loginMutation.reset();

    if (!email.includes("@")) {
      setValidationError(t("login.errors.invalidEmail"));
      return;
    }
    if (password.length < 6) {
      setValidationError(t("login.errors.shortPassword"));
      return;
    }

    loginMutation.mutate();
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

        {displayError !== "" && (
          <Text className="mb-2 text-sm text-red-600" accessibilityRole="alert">
            {displayError}
          </Text>
        )}

        <Pressable
          className="mt-4 items-center rounded-lg bg-[#fd6901] py-3"
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
            {t("login.noAccount")}
          </Text>
          <Link href="/register" asChild>
            <Pressable>
              <Text className="ml-1 text-sm font-semibold text-[#fd6901]">
                {t("login.register")}
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScreenContainer>
  );
}
