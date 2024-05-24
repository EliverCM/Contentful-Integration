import { Module } from 'vuex';
import { RootState } from '@/store/types';
import { EventsState } from './types';
import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';

export const EVENTS: Module<EventsState, RootState> = {
    namespaced: true,
    state: {
        events: [],
    },
    mutations,
    getters,
    actions
};
