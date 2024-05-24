import { MutationTree } from 'vuex';
import { UserState } from '@/modules/user/store/types';

export enum SentimentsMutations {
    SET_SURVEY = 'SET_SURVEY',
    SET_OPEN_EMOTIONS = 'SET_OPEN_EMOTIONS',
    SET_COMMENT_BOX = 'SET_COMMENT_BOX',
    SET_PHONE_NUMBER = 'SET_PHONE_NUMBER',
    SET_SENTIMENTS = 'SET_SENTIMENTS',
    SET_PARAMETERS = 'SET_PARAMETERS'
}

export const mutations: MutationTree<any> = {
    [SentimentsMutations.SET_SURVEY] (state, payload) {
        state.survey = payload;
    },
    [SentimentsMutations.SET_OPEN_EMOTIONS] (state, payload) {
        state.openEmotions = payload;
    },
    [SentimentsMutations.SET_COMMENT_BOX] (state, payload) {
        state.commentBox = payload;
    },
    [SentimentsMutations.SET_PHONE_NUMBER] (state, payload) {
        state.phoneNumber = payload;
    },
    [SentimentsMutations.SET_SENTIMENTS] (state, payload) {
        state.sentiments = payload;
    },
    [SentimentsMutations.SET_PARAMETERS] (state, payload) {
        state.parameters = payload;
    },
};
