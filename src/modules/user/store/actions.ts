import { ActionTree } from 'vuex';
import axios from 'axios';
import mytp from '@/api/mytp';
import { AccessTokens, Menu, UserState } from '@/modules/user/store/types';
import { RootState } from '@/store/types';
import { UserMutations } from '@/modules/user/store/mutations';
//import apiEws and apiRaf
import apiEws from '@/api/apiEws';
import apiRaf from '@/api/apiRaf';
import apiLang from '@/api/mytpTranslations/apiLang';

export const actions: ActionTree<UserState, RootState> = {

    async getAccessTokens ({ state, dispatch }): Promise<AccessTokens> {
        if (!Object.keys(state.accessTokens).length) {
            await dispatch('fetchAccessTokens');
            await Promise.all([
                dispatch('getIdentityProfile'),
                dispatch('getUserModules'),
                // dispatch('fetchMytpData'),
                dispatch('initialize', null, { root: true })
            ]);
        }

        return state.accessTokens;
    },

    async fetchAccessTokens ({ commit }): Promise<void> {
        try {
            // setup axios
            axios.defaults.withCredentials = true;

            // get tokens from Identity Platform
            const tokenRequest = await axios.get(process.env.VUE_APP_MSAL_URL);

            // store the tokens with names from each resourse
            const accessTokens: AccessTokens = {};
            const keys = Object.keys(tokenRequest.data.accessTokens);
            keys.forEach(key => {
                const token = Reflect.get(tokenRequest.data.accessTokens, key);
                if (token.aud === '00000003-0000-0000-c000-000000000000') {
                    accessTokens.msGraph = token.secret;
                } else if (token.aud === '32180b2d-1572-4b3b-bd90-29cff5de8f42') {
                    accessTokens.mytpAzure = token.secret;
                }
            });
            // await dispatch('setTokenFirebase');
            commit(`user/${UserMutations.SET_ACCESS_TOKEN}`, accessTokens, { root: true });
        } catch (error) {
            //alert(process.env.VUE_APP_LOGIN_URL);
            const currentUrl = location.toString()
                .replace(/:/ig, '%3A')
                .replace(/\//g, '%2F');
            console.error('catch event', process.env.VUE_APP_LOGIN_URL + currentUrl);
            window.location.href = process.env.VUE_APP_LOGIN_URL + currentUrl;
        }
    },


    // async fetchMytpData ({ state, commit }): Promise<void> {
    //     try {
    //         const mytpToken = (await apiPlatform.getTokenPlatform()).data.token;
    //         commit(`user/${UserMutations.SET_ACCESS_TOKEN_MYTP}`, mytpToken, { root: true });
    //     } catch (error) {
    //         console.log('INTERNAL ERROR: unable to obtain data necessary for myTP API access');
    //     }
    // },

    async getIdentityProfile ({ commit }) {
        try {
            const profile = await axios.get(process.env.VUE_APP_PROFILE_URL);
            commit(`user/${UserMutations.SET_IDENTITY_PROFILE}`, profile.data, { root: true });
        } catch (error) {
            console.error('ERROR: Error get identity profile');
        }
    },


    async getUserModules ({ commit }) {
        const res: Menu[] = (await mytp.getUserModules()).data.modules;
        commit(`user/${UserMutations.SET_MENU}`, res, { root: true });
        return res;
    },

    async getAccessEWS ({ commit }) {
        const res = (await apiEws.getAccess()).data;
        commit(`user/${UserMutations.SET_HAS_ACCESS_EWS}`, res, { root: true });
        return res;
    },

    async getAccessRaf ({ commit }) {
        const res = (await apiRaf.getAccess()).data;
        commit(`user/${UserMutations.SET_HAS_ACCESS_RAF}`, res.hasAccess, { root: true });
        return res.hasAccess;
    },
    async getLenguageApp ({commit}, payload = 'en') {
        const langData = (await apiLang.getLang(payload)).data;
        return langData;
    },
    async getLenguagesOptions () {
        const langs = (await apiLang.getSupportLang()).data;
        return langs;
    },
};
