import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './en.json';
import zh_Hans from './zh-Hans.json';
import zh_Hant from './zh-Hant.json';

const translations = {
  'en': en,
  'zh': zh_Hans,
  'zh-Hant': zh_Hant,
};

const i18n = new I18n(translations);

i18n.locale = getLocales()[0].languageCode?? 'en';

i18n.enableFallback = true;

export default i18n