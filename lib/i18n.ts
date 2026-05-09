import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import en from '../locales/en.json';
import ar from '../locales/ar.json';
import fil from '../locales/fil.json';
import fr from '../locales/fr.json';
import hi from '../locales/hi.json';
import es from '../locales/es.json';
import ti from '../locales/ti.json';
import uk from '../locales/uk.json';

export const RTL_LOCALES = ['ar', 'ti'];

export function applyRTL(locale: string) {
  const isRTL = RTL_LOCALES.includes(locale);
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    fil: { translation: fil },
    fr: { translation: fr },
    hi: { translation: hi },
    es: { translation: es },
    ti: { translation: ti },
    uk: { translation: uk },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;
