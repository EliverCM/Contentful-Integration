// --- Translations
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: localStorage.getItem('language') || 'en',
    fallbackLocale: 'en',
});

export default i18n;