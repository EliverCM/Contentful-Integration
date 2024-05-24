import { Module } from 'vuex';
import { RootState } from '@/store/types';

import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { ManageUsersState } from './types';

export const DELEGATEUSERS: Module<ManageUsersState, RootState> = {
    namespaced: true,
    state: {
        companies: [],
        users: [],
        company: undefined,
        user: undefined,
        // user: undefined,
    },
    mutations,
    getters,
    actions
};
