import { MutationTree } from 'vuex';
import { Notification, NotificationList } from '@/modules/notifications/store/types';

export enum NotificationsMutations {
    SET_NOTIFICATIONS_LIST = 'SET_NOTIFICATIONS_LIST'
}

export const mutations: MutationTree<NotificationList> = {
    [NotificationsMutations.SET_NOTIFICATIONS_LIST] (state, payload: Notification[]) {
        state.notificationList = payload;
    }
};
