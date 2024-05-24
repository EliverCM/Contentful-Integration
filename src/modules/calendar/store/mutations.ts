import { MutationTree } from 'vuex';
import { EventsState } from './types';

export enum EventsMutations {
    SET_EVENTS = 'SET_EVENTS',
}

export const mutations: MutationTree<EventsState> = {
    [EventsMutations.SET_EVENTS] (state, payload) {
        state.events = payload;
    },
};
