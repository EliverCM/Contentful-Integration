import {Module} from 'vuex';
import {UserState} from '@/modules/user/store/types';
import {RootState} from '@/store/types';
import {mutations} from '@/modules/user/store/mutations';
import {getters} from '@/modules/user/store/getters';
import {actions} from '@/modules/user/store/actions';

export const user: Module<UserState, RootState> = {
    namespaced: true,
    state: {
        obtainedAccessTokens: false,
        accessTokens: {},
        tpId: '',
        me: {},
        identityProfile: {},
        identityProfilePlatform: {},
        userImg: null,
        parameters: null,
        permissions: {},
        sentiments: {
            descStatusTicket: null,
            datetimestamp: null
        },
        extraInfo: {},
        expandMenu: true,
        loadingData: false,
        menu: {},
        idProfileHost: '',
        canhost: false,
        sidebarstatus: true,
        hasAccessEWS: false,
        hasAccessRaf: false,
    },
    mutations,
    getters,
    actions
};
