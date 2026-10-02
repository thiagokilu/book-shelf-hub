import { ScreenContainer } from "@/components/ScreenContainer";
import { useAuth } from "@/context/authContext";
import { useThemeColors } from "@/context/colors";
import { signUp } from "@/lib/http/auth/sign-up";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { saveTokens } from "../lib/auth/storage";

export default function RegisterScreen() {
  const { t } = useTranslation();
  const c = useThemeColors();
  const router = useRouter();
  const { signIn } = useAuth();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const usernameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  async function handleSubmit() {
    setError("");

    if (name.trim().length < 2) {
      setError(t("register.errors.shortName"));
      return;
    }
    if (username.trim().length < 3) {
      setError(t("register.errors.shortUsername"));
      return;
    }
    if (!email.includes("@")) {
      setError(t("register.errors.invalidEmail"));
      return;
    }
    if (password.length < 6) {
      setError(t("register.errors.shortPassword"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("register.errors.passwordMismatch"));
      return;
    }

    setLoading(true);
    try {
      const result = await signUp({
        name,
        username,
        email,
        password,
        bio: "",
      });

      if (result.ok) {
        // Verifica se a API retornou tokens
        if (result.data.accessToken) {
          await saveTokens(result.data.accessToken, result.data.refreshToken || "");
          
          // Pequeno delay para garantir que o token foi salvo
          await new Promise(resolve => setTimeout(resolve, 100));
          
          signIn();

          // Outro delay para garantir que o estado de autenticação foi atualizado
          await new Promise(resolve => setTimeout(resolve, 100));
          
          router.replace("/");
        } else {
          // Se não retornou tokens, redireciona para login
          router.push("/login");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("register.errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "mb-4 rounded-lg border border-gray-400 px-3 py-3 text-base";

  return (
    <ScreenContainer>
      <View className="mt-[60px] mb-2 w-full px-4">
        <Text className="mb-1 text-[32px] font-bold" style={{ color: c.text }}>
          {t("register.title")}
        </Text>
        <Text className="mb-6 text-base" style={{ color: c.text, opacity: 0.7 }}>
          {t("register.subtitle")}
        </Text>

        <Text className="mb-1 text-sm font-medium" style={{ color: c.text }}>
          {t("register.name")}
        </Text>
        <TextInput
          className={inputClass}
          style={{ color: c.text }}
          value={name}
          onChangeText={setName}
          placeholder={t("register.namePlaceholder")}
          placeholderTextColor="#9ca3af"
          autoCapitalize="words"
          autoComplete="name"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => usernameRef.current?.focus()}
          blurOnSubmit={false}
        />

        <Text className="mb-1 text-sm font-medium" style={{ color: c.text }}>
          {t("register.username")}
        </Text>
        <TextInput
          ref={usernameRef}
          className={inputClass}
          style={{ color: c.text }}
          value={username}
          onChangeText={setUsername}
          placeholder={t("register.usernamePlaceholder")}
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          autoComplete="username-new"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />

        <Text className="mb-1 text-sm font-medium" style={{ color: c.text }}>
          {t("register.email")}
        </Text>
        <TextInput
          ref={emailRef}
          className={inputClass}
          style={{ color: c.text }}
          value={email}
          onChangeText={setEmail}
          placeholder={t("register.emailPlaceholder")}
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <Text className="mb-1 text-sm font-medium" style={{ color: c.text }}>
          {t("register.password")}
        </Text>
        <TextInput
          ref={passwordRef}
          className={inputClass}
          style={{ color: c.text }}
          value={password}
          onChangeText={setPassword}
          placeholder={t("register.passwordPlaceholder")}
          placeholderTextColor="#9ca3af"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password-new"
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
        />

        <Text className="mb-1 text-sm font-medium" style={{ color: c.text }}>
          {t("register.confirmPassword")}
        </Text>
        <TextInput
          ref={confirmRef}
          className="mb-2 rounded-lg border border-gray-400 px-3 py-3 text-base"
          style={{ color: c.text }}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={t("register.confirmPasswordPlaceholder")}
          placeholderTextColor="#9ca3af"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password-new"
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
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
            <Text className="text-base font-semibold text-white">{t("register.submit")}</Text>
          )}
        </Pressable>
      </View>
    </ScreenContainer>
  );
}