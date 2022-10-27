import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import * as Localization from 'expo-localization';

i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: Localization.locale,
    fallbackLng: 'es',
    resources: {
        en: {
            translation: require("../lang/en.json"),
        },
        es: {
            translation: require("../lang/es.json"),
        },
    },
});
export default i18n;
