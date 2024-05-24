import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';

import { ManageUsersState } from './types';

export const getters: GetterTree<ManageUsersState, RootState> = {

    getCompanies (state): unknown {
        return state.companies;
    },

    getUsers (state): unknown {
        return state.users;
    },

    getCompany (state): unknown {
        return state.company;
    },

    getUser (state): unknown {
        return state.user;
    },

    // getUser (state): unknown {
    //     return state.user;
    // },

};
