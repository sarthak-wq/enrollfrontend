import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";

/**
 * i18n Configuration for Localization
 *
 * This file sets up and initializes the `i18n` library for use in a React application,
 * enabling internationalization (i18n) and localization (l10n).
 *
 * The configuration uses:
 * - `i18next-http-backend` for loading translation files.
 * - `react-i18next` for seamless integration with React components.
 */
i18n.use(HttpApi)
    .use(initReactI18next)
    .init({
        lng: 'en',
        debug: true,
        fallbackLng: 'en',
        ns: ['common'],
        backend: {
            loadPath: '/i18n/{{lng}}/{{ns}}.json'
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;