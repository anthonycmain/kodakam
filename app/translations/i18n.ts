import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en-us.json';
import de from './de-de.json';

const resources = {
  en,
  de
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    keySeparator: '.',
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: { useSuspense: false },
    compatibilityJSON: 'v3',
  });

/**
 * Export a t() method that is bound to a i18n instance.
 * Useful in places where we are not able to call the useTranslation hook to get the t() method.
 *
 * This helps solve an issue that arose with our use of the t() method in error-handling-service.ts
 * See:
 *  https://github.com/i18next/i18next/issues/1287
 *  https://github.com/dailypay/native-mobile/pull/856
 */
const t = i18n.t.bind(i18n);
export { t };

export default i18n;