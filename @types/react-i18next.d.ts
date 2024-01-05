import 'react-i18next';
import en from '../app/translations/en-us.json';
import de from '../app/translations/de-de.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: typeof en;
  }
}