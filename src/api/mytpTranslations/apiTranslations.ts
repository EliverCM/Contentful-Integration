import axios from 'axios';
import store from '@/store';


const URL = process.env.VUE_APP_SUPPORTTED_LANG_URL;
// const URL = 'https://mytp-dev.azurewebsites.net/api/v1/';
export const api = axios.create({
    baseURL: URL,
});
const EXCEPTIONS = [  // INCLUDE HERE EXCEPCTIONS WITHOUT AUTHORIZATION HEADER!!
    process.env.VUE_APP_MSAL_URL,
    process.env.VUE_APP_MYTPAPI_URL,
    process.env.VUE_APP_SUPPORTTED_LANG_URL,
    process.env.VUE_APP_PROFILE_URL,
    process.env.VUE_APP_LANG_URL
];
api.interceptors.request.use(function (config) {
    if (!EXCEPTIONS.some((URL) => config.url?.includes(URL))) {
        const token = 'Bearer ' + store.getters['user/getAccessTokens'].mytpAzure;
        config.headers.Authorization = token;
    }
    return config;
});

api.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    if (error.response.status === 401 && error.config.baseURL === URL) {
        const originalRequest = error.config;
        await store.dispatch('user/fetchAccessTokens');
        await store.dispatch('user/fetchMytpData');
        const accessToken = store.getters.user.getAccessTokens.mytpAzure;
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        return axios(originalRequest);
    } else {
        return Promise.reject(error);
    }
});

export default {
    URL,
  
    async getParameters () {
        return api.post('getParameters', {});
    },

    async getUserExtraInfo (idccms: any[]) {
        return api.post('/General/getEmployeeSettings', {
            idccmss: idccms
        });
    },
};
