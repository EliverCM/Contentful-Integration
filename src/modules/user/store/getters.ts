import { GetterTree } from 'vuex';
import { AccessTokens, UserState } from '@/modules/user/store/types';
import { RootState } from '@/store/types';

export const getters: GetterTree<UserState, RootState> = {
    getAccessTokens (state): AccessTokens {
        return state.accessTokens;
    },
    getIdentityProfile (state): unknown {
        return state.identityProfile;
    },
    getActiveEmotion (state): unknown {
        return state.sentiments;
    },
    getExtraInfo (state): unknown {
        return state.extraInfo;
    },
    getExpandMenu (state): unknown {
        return state.expandMenu;
    },
    getLoadingData (state): unknown {
        return state.loadingData;
    },
    getUserPermissions (state): unknown {
        return state.permissions;
    },
    getMenu (state): unknown {
        return state.menu;
    },
    getCanHost (state): unknown {
        return state.canhost;
    },
    getIdProfileHost (state): unknown {
        return state.idProfileHost;
    }

};
