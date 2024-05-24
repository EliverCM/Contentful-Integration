import axios from 'axios';
import store from '@/store';
import { SentSurvey } from '@/modules/sentiments/store/types';

const URL = process.env.VUE_APP_MYTPSENTIMENTSAPI_URL;
export const api = axios.create({
    baseURL: URL,
});
const EXCEPTIONS = [  // INCLUDE HERE EXCEPCTIONS WITHOUT AUTHORIZATION HEADER!!
    process.env.VUE_APP_MSAL_URL,
    process.env.VUE_APP_MYTPSENTIMENTSAPI_URL,
    process.env.VUE_APP_PROFILE_URL,
];
api.interceptors.request.use(function (config) {
    if (!EXCEPTIONS.some((URL) => URL === config.url)) {
        const token = 'Bearer ' + store.getters['user/getAccessTokens'].mytpAzure;
        config.headers.Authorization = token;

        const canhost = store.getters['user/getCanHost'];
        const oidHostUser = store.getters['user/getIdProfileHost'];
        if (canhost && oidHostUser) {
            config.headers['X-Accounttesting'] = btoa(oidHostUser);
        }
    }
    return config;
});

api.interceptors.response.use(function (response) {
    // response.headers['Authorization'] = 'Bearer ' + store.getters['user/getAccessTokens'].mytp;
    return response;
}, async function (error) {
    if (error.response.status === 401 && error.config.baseURL === URL) {
        const originalRequest = error.config;
        await store.dispatch('user/fetchAccessTokens');
        await store.dispatch('user/fetchMytpData');
        const accessToken = store.getters['user/getAccessTokens'].mytpAzure;
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        originalRequest.withCredentials = false;
        return axios(originalRequest);
    } else {
        return Promise.reject(error);
    }
});

export default {
    URL,
    async getActiveNotifications () {
        return api.post('getActiveNotifications', {});
    }, 
    

    async getUserExtraInfo (idccms: any[]) {
        return api.post('/General/getEmployeeSettings', {
            idccmss: idccms
        });
    },
    async getTokenPlatform () {
        return api.post('/validateAzureToken', {});
    },
    async getEmotionList () {
        return api.get('sentiments/emotionlist');
    },

    async getReasons () {
        return api.get('sentiments/reasons');
    },

    async getTpClient () {
        return api.get('sentiments/cancreatetpclient');
    },

    async sendSurvey (survey: SentSurvey) {
        return api.post('sentiments/sentimentssurvey', survey);
    },
    
    async getParameters () {
        return api.get('sentiments/parameters', {});
    },
 
    async syncSentiments () {
        return api.get('sentiments/lastemotion');
    },
};
