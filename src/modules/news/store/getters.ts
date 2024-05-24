import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';
import { NewsState, FilterTagsI, FiltersI } from './types';

export const getters: GetterTree<NewsState, RootState> = {
    getNews (state): Array<any> {
        return state.myInterestsNews;
    },

    getCoupons (state): Array<any> {
        return state.coupons;
    },
    getBenefits (state): Array<any> {
        return state.benefits;
    },
    getCurrentPages (state): object {
        return state.currentPages;
    },

    getLikes (state): Array<any> {
        return state.likes;
    },

    getRooms (state): Array<string> {
        return state.rooms;
    },

    getFilters (state): Array<FiltersI> {
        return state.filters;
    },
    getFilterTags (state): FilterTagsI {
        return state.filterTags;
    },

    hasFilters (state): boolean {
        return !!(state.filterTags.category.length || state.filterTags.geoSource.length);
    },

    getLoading (state): boolean {
        return state.loading;
    }
};
