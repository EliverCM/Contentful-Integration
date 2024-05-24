import { MutationTree } from 'vuex';
import { UserState } from '@/modules/user/store/types';

export enum UserMutations {
    SET_OBTAINED_ACCESS_TOKENS = 'SET_OBTAINED_ACCESS_TOKENS',
    SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN',
    SET_ACCESS_TOKEN_MYTP = 'SET_ACCESS_TOKEN_MYTP',
    SET_ME = 'SET_ME',
    SET_IDENTITY_PROFILE = 'SET_IDENTITY_PROFILE',
    SET_IDENTITY_PROFILE_PLATFORM = 'SET_IDENTITY_PROFILE_PLATFORM',
    SET_USER_IMAGE = 'SET_USER_IMAGE',
    SET_TP_ID = 'SET_TP_ID',
    SET_PARAMETERS = 'SET_PARAMETERS',
    SET_SENTIMENTS = 'SET_SENTIMENTS',
    SET_EXTRAINFO = 'SET_EXTRAINFO',
    SET_EXPAND_MENU = 'SET_EXPAND_MENU',
    SET_LOADING_DATA = 'SET_LOADING_DATA',
    SET_MENU = 'SET_MENU',
    SET_MENU_READY = 'SET_MENU_READY',
    SET_PERMISSIONS = 'SET_PERMISSIONS',
    SET_ID_PROFILE_HOST = 'SET_ID_PROFILE_HOST',
    SET_CANHOST = 'SET_CANHOST',
    SET_SIDEBARSTATUS = 'SET_SIDEBARSTATUS',
    SET_HAS_ACCESS_EWS = 'SET_HAS_ACCESS_EWS',
    SET_HAS_ACCESS_RAF = 'SET_HAS_ACCESS_RAF',
}

export const mutations: MutationTree<UserState> = {
    [UserMutations.SET_OBTAINED_ACCESS_TOKENS] (state, payload) {
        state.obtainedAccessTokens = payload;
    },
    [UserMutations.SET_ACCESS_TOKEN] (state, payload) {
        state.accessTokens = payload;
    },
    [UserMutations.SET_ACCESS_TOKEN_MYTP] (state, payload) {
        state.accessTokens.mytp = payload;
    },
    [UserMutations.SET_ME] (state, payload) {
        state.me = payload;
    },
    [UserMutations.SET_IDENTITY_PROFILE] (state, payload) {
        state.identityProfile = payload;
    },
    [UserMutations.SET_IDENTITY_PROFILE_PLATFORM] (state, payload) {
        state.identityProfilePlatform = payload;
    },
    [UserMutations.SET_USER_IMAGE] (state, payload) {
        state.userImg = payload;
    },
    [UserMutations.SET_TP_ID] (state, payload) {
        state.tpId = payload;
    },
    [UserMutations.SET_PARAMETERS] (state, payload) {
        state.parameters = payload;
    },
    [UserMutations.SET_SENTIMENTS] (state, payload) {
        state.sentiments = payload;
    },
    [UserMutations.SET_EXTRAINFO] (state, payload) {
        state.extraInfo = payload;
    },
    [UserMutations.SET_EXPAND_MENU] (state, payload) {
        state.expandMenu = payload;
    },
    [UserMutations.SET_LOADING_DATA] (state, payload) {
        state.loadingData = payload;
    },
    [UserMutations.SET_MENU] (state, payload) {
        state.menu = payload;
    },
    [UserMutations.SET_PERMISSIONS] (state, payload) {
        state.permissions = payload;
    },
    [UserMutations.SET_ID_PROFILE_HOST] (state, payload) {
        state.idProfileHost = payload;
    },
    [UserMutations.SET_CANHOST] (state, payload) {
        state.canhost = payload;
    },
    [UserMutations.SET_SIDEBARSTATUS] (state, payload) {
        state.sidebarstatus = payload;
    },
    [UserMutations.SET_HAS_ACCESS_EWS] (state, payload) {
        state.hasAccessEWS = payload;
    },
    [UserMutations.SET_HAS_ACCESS_RAF] (state, payload) {
        state.hasAccessRaf = payload;
    },
};
