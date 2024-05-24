import axios from 'axios';
import store from '@/store';

const URL = process.env.VUE_APP_RAF_API;
export const api = axios.create({
    baseURL: URL,
});

// automatically include the access token into the requests
api.interceptors.request.use(function (config) {
    const token = 'Bearer ' + store.getters['user/getAccessTokens'].mytpAzure;
    config.headers.Authorization = token;
    return config;
});

// automatically re-try failed requests after attempting to obtain a new access token
api.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    if (error.response.status === 401 && error.config.baseURL === URL) {
        const originalRequest = error.config;
        await store.dispatch('user/fetchAccessTokens');
        const accessToken = store.getters['user/getAccessTokens'].mytpAzure;
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        return axios(originalRequest);
    } else {
        return Promise.reject(error);
    }
});

export default {
    URL,

    async getAccess () {
        return api.get('users/me');
    },
};