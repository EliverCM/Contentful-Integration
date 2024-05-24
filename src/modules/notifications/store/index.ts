import {Module} from 'vuex';
import {NotificationList} from '@/modules/notifications/store/types';
import {RootState} from '@/store/types';
import {mutations} from '@/modules/notifications/store/mutations';
import {getters} from '@/modules/notifications/store/getters';
import {actions} from '@/modules/notifications/store/actions';

export const NOTIFICATIONS: Module<NotificationList, RootState> = {
    namespaced: true,
    state: {
        notificationList: [],
    },
    mutations,
    getters,
    actions
};
