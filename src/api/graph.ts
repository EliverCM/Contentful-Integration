import axios from 'axios';
import store from '@/store';

const URL = process.env.VUE_APP_GRAPH_URL;
const graph = axios.create({
    baseURL: URL
});

graph.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    if (error.response.status === 401 && error.config.baseURL === URL) {
        const originalRequest = error.config;
        await store.dispatch('user/fetchAccessTokens');
        const accessToken = store.getters.user.getAccessTokens.msGraph;
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        return axios(originalRequest);
    } else {
        return Promise.reject(error);
    }
});

export default {
    URL, async getMe (msGraphToken: string) {
        return graph.get('beta/me', {
            headers: {
                'Authorization': 'Bearer ' + msGraphToken
            }
        });
    },
    async photo (msGraphToken: string) {
        return graph.get('beta/me/photo/$value', {
            headers: {
                'Authorization': 'Bearer ' + msGraphToken
            },
            responseType: 'blob'
        });
    }
};
