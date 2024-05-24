import { createStore, StoreOptions } from 'vuex';
import { RootState } from '@/store/types';
import { UserMutations } from '@/modules/user/store/mutations';
import { user } from '@/modules/user/store';
import graph from '@/api/graph';
import { blobToBase64 } from '@/tools/blob-process';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { NEWS } from '../modules/news/store/index';
import { EVENTS } from '../modules/calendar/store/index';
import { DELEGATEUSERS } from '../modules/admin/store';
import { NOTIFICATIONS } from '../modules/notifications/store';

//SENTIMENTS
import { SENTIMENTS } from '@/modules/sentiments/store';

export enum AppMutations {
    SET_INITIALIZED = 'SET_INITIALIZED',
    SET_ALLOWED = 'SET_ALLOWED',
    SET_APPINSIGHTS = 'SET_APPINSIGHTS',
}

const store: StoreOptions<RootState> = {
    state: {
        initialized: false,
        allowed: false,
    },
    mutations: {
        [AppMutations.SET_INITIALIZED] (state, payload: boolean) {
            state.initialized = payload;
        },
        [AppMutations.SET_ALLOWED] (state, payload: boolean) {
            state.allowed = payload;
        },
        [AppMutations.SET_APPINSIGHTS] (state, payload: ApplicationInsights) {
            state.appInsights = payload;
        }
    },
    actions: {
        async initialize ({ commit, rootGetters }) {
            const tokens = rootGetters['user/getAccessTokens'];

            // MS Graph - Get 'me' information
            const p0 = graph.getMe(tokens.msGraph);

            // MS Graph - Get User Image
            const p1 = graph.photo(tokens.msGraph);

            await Promise.allSettled([p0, p1])
                .then(async (r) => {
                    // r[0] is the return of the ME call
                    if (r[0].status === 'fulfilled') {
                        const me = r[0].value;
                        commit(`user/${UserMutations.SET_ME}`, me.data, { root: true });
                        commit(AppMutations.SET_INITIALIZED, true, { root: true });
                    } else {
                        console.log('Cannot get user data');
                    }

                    // r[1] is the return of the user image call
                    if (r[1].status === 'fulfilled') {
                        const imgResponse = r[1].value;
                        blobToBase64(imgResponse.data)
                            .then((result: string) => {
                                commit(`user/${UserMutations.SET_USER_IMAGE}`, result);
                            });
                    } else {
                        console.log('Cannot get user photo');
                    }
                });
        },


        async logout () {
            try {
                window.location.href = process.env.VUE_APP_LOGOUT_URL;
            } catch (err) {
                console.log('Could not logout', err);
            }
        },
    },
    modules: {
        user,
        NEWS,
        DELEGATEUSERS,
        SENTIMENTS,
        NOTIFICATIONS,
        EVENTS,
    },
    getters: {
        getAllowed (state) {
            return state.allowed;
        }
    }
};

export default createStore(store);
