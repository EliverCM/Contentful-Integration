import store from '@/store';
import { io } from 'socket.io-client';


export const socketClient = io(
    process.env.VUE_APP_MYTPAPI_URL.replace('v2', 'notifications'),
    {
        path: '/websockets',
        transports: ['websocket'],
        auth: { authorization: 'Bearer ' + store.getters['user/getAccessTokens'].mytpAzure }
    }
);
