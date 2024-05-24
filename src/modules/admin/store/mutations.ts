import { MutationTree } from 'vuex';
import { ManageUsersState } from './types';

export enum ManageUsersMutations {
    SET_COMPANIES = 'SET_COMPANIES',
    SET_USERS = 'SET_USERS',
    SET_USER = 'SET_USER',
    SET_COMPANY = 'SET_COMPANY',
    // SET_USER = 'SET_USER',
}

export const mutations: MutationTree<ManageUsersState> = {
    [ManageUsersMutations.SET_COMPANIES] (state, payload) {
        console.log('Payload', payload);
        state.companies = payload;
    },
    [ManageUsersMutations.SET_USERS] (state, payload) {
        state.users = payload;
    },
    [ManageUsersMutations.SET_USER] (state, payload) {
        state.user = payload;
    },
    [ManageUsersMutations.SET_COMPANY] (state, payload) {
        state.company = payload;
    },
    // [ManageUsersMutations.SET_USER] (state, payload) {
    //     state.user = payload;
    // },
};
