import { api } from '@/api/mytpTranslations/apiTranslations';

export default {

    async getLang (lang: string) {
        const result = api.get(`/languages/${process.env.VUE_APP_LOCATE_FILE_NAME}/${lang}.json`, { withCredentials : false });
        return result;
    },
    async getSupportLang () {
        const result = api.get(`/languages/${process.env.VUE_APP_LOCATE_FILE_NAME}/supported_languages.json`, { withCredentials : false });
        return result;
    },
};