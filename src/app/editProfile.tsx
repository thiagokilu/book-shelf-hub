// app/editProfile.tsx
import { ScreenContainer } from "@/components/ScreenContainer";
import { useThemeColors } from "@/context/colors";
import { useUser } from "@/context/userContext";
import { editUserProfile } from "@/lib/http/user/editeuserprofile";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const USERNAME_REGEX = /^[a-z0-9_.]{3,20}$/;

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const c = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isLoading } = useUser();

  const [name, setName] = useState(user?.name || "");
  const [userName, setUserName] = useState(user?.username || "");
  const [picture, setPicture] = useState<string | null>(user?.profileImageUrl || null);
  const [bio, setBio] = useState(user?.bio || "");

  if (isLoading) {
    return <ScreenContainer />;
  }

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUserName(user.username || "");
      setPicture(user.profileImageUrl || null);
      setBio(user.bio || "");
    }
  }, [user]);

  const nameError =
    name.trim().length === 0 ? t("editProfile.nameRequired") : null;
  const userNameError = !USERNAME_REGEX.test(userName)
    ? t("editProfile.userNameInvalid")
    : null;
  const canSave = !nameError && !userNameError;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setPicture(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!canSave) return;

    await editUserProfile({
      name: name.trim(),
      username: userName,
      bio: bio.trim(),
      profileImageUrl: picture,
    });

    router.back();
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        className="w-full flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-4 z-10"
          style={{ top: insets.top + 8 }}
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
        >
          <FontAwesome name="arrow-left" size={24} color={c.text} />
        </TouchableOpacity>

        <ScrollView
          style={{ backgroundColor: c.bg }}
          contentContainerClassName="w-full gap-6 px-5"
          contentContainerStyle={{
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="w-full"
        >
          <Text
            className="mt-6 text-center text-[24px] font-bold"
            style={{ color: c.text }}
          >
            {t("editProfile.title")}
          </Text>

          {/* Avatar */}
          <View className="items-center">
            <Pressable
              onPress={pickImage}
              accessibilityRole="button"
              accessibilityLabel={t("editProfile.changePhoto")}
              className="active:opacity-70"
            >
              {picture ? (
                <Image
                  source={{ uri: picture }}
                  className="h-[100px] w-[100px] rounded-full"
                  style={{ backgroundColor: c.bgMuted }}
                />
              ) : (
                <FontAwesome name="user-circle" size={100} color={c.text} />
              )}
              <View
                className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: c.text }}
              >
                <FontAwesome name="camera" size={14} color={c.bg} />
              </View>
            </Pressable>
            <TouchableOpacity onPress={pickImage} className="mt-3">
              <Text className="text-sm font-semibold" style={{ color: c.text }}>
                {t("editProfile.changePhoto")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Nome */}
          <View className="gap-2">
            <Text className="text-sm font-semibold" style={{ color: c.text }}>
              {t("editProfile.name")}
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t("editProfile.namePlaceholder")}
              placeholderTextColor={c.textMuted}
              autoCapitalize="words"
              maxLength={50}
              className="w-full rounded-xl px-4 py-3 text-base"
              style={{ backgroundColor: c.bgMuted, color: c.text }}
            />
            {nameError && (
              <Text className="text-xs text-red-500">{nameError}</Text>
            )}
          </View>

          {/* Username */}
          <View className="gap-2">
            <Text className="text-sm font-semibold" style={{ color: c.text }}>
              {t("editProfile.userName")}
            </Text>
            <View
              className="w-full flex-row items-center rounded-xl px-4"
              style={{ backgroundColor: c.bgMuted }}
            >
              <Text className="text-base" style={{ color: c.textMuted }}>
                @
              </Text>
              <TextInput
                value={userName}
                onChangeText={(v) =>
                  setUserName(v.toLowerCase().replace(/\s/g, ""))
                }
                placeholder={t("editProfile.userNamePlaceholder")}
                placeholderTextColor={c.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
                className="flex-1 py-3 pl-1 text-base"
                style={{ color: c.text }}
              />
            </View>
            {userNameError && (
              <Text className="text-xs text-red-500">{userNameError}</Text>
            )}
          </View>

          {/* Bio */}
          <View className="gap-2">
            <Text className="text-sm font-semibold" style={{ color: c.text }}>
              {t("editProfile.bio")}
            </Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder={t("editProfile.bioPlaceholder")}
              placeholderTextColor={c.textMuted}
              multiline
              maxLength={160}
              textAlignVertical="top"
              className="min-h-[100px] w-full rounded-xl px-4 py-3 text-base"
              style={{ backgroundColor: c.bgMuted, color: c.text }}
            />
          </View>

          {/* Salvar */}
          <Pressable
            onPress={handleSave}
            disabled={!canSave}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSave }}
            className="mt-2 items-center rounded-full py-3.5 active:opacity-80"
            style={{ backgroundColor: c.text, opacity: canSave ? 1 : 0.4 }}
          >
            <Text className="text-base font-semibold" style={{ color: c.bg }}>
              {t("editProfile.save")}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
