import { api } from '@/api/notifications';

export default {
    async getNotifications (counter: number) {
        return api.post('getNotifications',
            {
                active: null,
                counter: counter,
                codExtern: 10,
            },
        );
    },

    async markAsRead (idNotification: any) {
        return api.post('removeNotification', 
            {
                idNotification: idNotification,
                allRead: false,
            }
        );
    },
};
