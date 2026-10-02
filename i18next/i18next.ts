import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";
import { en } from "./locales/en";
import { pt } from "./locales/pt";

const getDeviceLanguage = () => {
  const deviceLanguage = getLocales()[0].languageCode || "en";
  return deviceLanguage.startsWith("pt") ? "pt" : "en";
};

const savedLanguage = AsyncStorage.getItem("language");
const initialLanguage = getDeviceLanguage();

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: en,
      pt: pt,
    },
    lng: initialLanguage, // if you're using a language detector, do not define the lng option
    fallbackLng: "en",

    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });

// Async update with saved language if it exists
savedLanguage.then((language) => {
  if (language) {
    const lng = language.startsWith("pt") ? "pt" : "en";
    console.log("Saved language:", language, "Updating to:", lng);
    i18n.changeLanguage(lng);
  }
});

const isRTL = getLocales()[0].textDirection === 'rtl';
I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);

export const deviceLanguage = initialLanguage;
export { isRTL };
export default i18n;