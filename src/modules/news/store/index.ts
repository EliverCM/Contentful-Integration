import {Module} from 'vuex';
import {RootState} from '@/store/types';
import { NewsState } from './types';
import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';

export const NEWS: Module<NewsState, RootState> = {
    namespaced: true,
    state: {
        myInterestsNews: [],
        coupons: [],
        benefits: [],
        currentPages: {},
        likes: [],
        rooms: [],
        filters: [],
        filterTags: {
            category: [],
            geoSource: []
        },
        loading: false
    },
    mutations,
    getters,
    actions
};
