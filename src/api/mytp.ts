import axios from 'axios';
import store from '@/store';

const URL = process.env.VUE_APP_MYTPAPI_URL;
export const api = axios.create({
    baseURL: URL,
});
const EXCEPTIONS = [  // INCLUDE HERE EXCEPCTIONS WITHOUT AUTHORIZATION HEADER!!
    process.env.VUE_APP_MSAL_URL,
    process.env.VUE_APP_MYTPAPI_URL,
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
    async getUserModules () {
        return api.get('users/me/modules');
    },
};
