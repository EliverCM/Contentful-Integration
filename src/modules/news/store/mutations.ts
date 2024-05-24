import { MutationTree } from 'vuex';
import { NewsState } from './types';

export enum NewsMutations {
    SET_NEWS = 'SET_NEWS',
    SET_COUPONS = 'SET_COUPONS',
    SET_BENEFITS = 'SET_BENEFITS',
    SET_CURRENT_PAGES = '    SET_CURRENT_PAGES',
    SET_LIKES = 'SET_LIKES',
    SET_ROOMS = 'SET_ROOMS',
    SET_FILTERS = 'SET_FILTERS',
    SET_FILTERTAGS = 'SET_FILTERTAGS',
    SET_LOADING = 'SET_LOADING',
}

export const mutations: MutationTree<NewsState> = {
    [NewsMutations.SET_NEWS] (state, payload) {
        state.myInterestsNews = payload;
    },
    [NewsMutations.SET_COUPONS] (state, payload) {
        state.coupons = payload;
    },
    [NewsMutations.SET_BENEFITS] (state, payload) {
        state.benefits = payload;
    },
    [NewsMutations.SET_CURRENT_PAGES] (state, payload) {
        state.currentPages = payload;
    },
    [NewsMutations.SET_LIKES] (state, payload) {
        state.likes = payload;
    },
    [NewsMutations.SET_ROOMS] (state, payload) {
        state.rooms = payload;
    },
    [NewsMutations.SET_FILTERS] (state, payload) {
        state.filters = payload;
    },
    [NewsMutations.SET_FILTERTAGS] (state, payload) {
        state.filterTags = payload;
    },
    [NewsMutations.SET_LOADING] (state, payload) {
        state.loading = payload;
    },
};
