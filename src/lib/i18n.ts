import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import es from '../locales/es';
import en from '../locales/en';
import pt from '../locales/pt';
import fr from '../locales/fr';

import type { Locale } from '../types';

export const SUPPORTED_LOCALES: Locale[] = ['es', 'en', 'pt', 'fr'];

void i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      pt: { translation: pt },
      fr: { translation: fr },
    },
    fallbackLng: 'es',
    supportedLngs: SUPPORTED_LOCALES,
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'vester-roi-locale',
      caches: ['localStorage'],
    },
    returnNull: false,
  });

export default i18next;
