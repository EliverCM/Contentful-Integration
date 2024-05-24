import { GetterTree } from 'vuex';
import { Notification, NotificationList } from '@/modules/notifications/store/types';
import { RootState } from '@/store/types';

export const getters: GetterTree<NotificationList, RootState> = {

    getNotifications (state): Notification[] {
        return state.notificationList;
    }
};
