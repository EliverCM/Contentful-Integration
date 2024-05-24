import { ActionTree } from 'vuex';
import { NotificationList } from '@/modules/notifications/store/types';
import { RootState } from '@/store/types';
import apiNotifications from '@/api/apiNotifications';

export const actions: ActionTree<NotificationList, RootState> = {
    async actGetNotificationList (_, counter): Promise<any> {
        const notifications = (await apiNotifications.getNotifications(counter)).data;
        // notifications.result.map(async (notification: Notification) => notification.dateCreated = await dispatch('user/transformDates', {
        //     ...info, value: new Date(notification.dateCreated)
        // },{root: true}));
        return notifications;
    },
    async actMarkAsRead (_, id) {
        console.log('Entra :>> ');
        const markAsRead = (await apiNotifications.markAsRead(id)).data;
        return markAsRead;
    },
};
