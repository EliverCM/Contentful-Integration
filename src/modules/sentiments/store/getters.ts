import { GetterTree } from 'vuex';
import { SentimentsState } from '@/modules/sentiments/store/types';
import { RootState } from '@/store/types';
import store from '@/store';

export const getters: GetterTree<SentimentsState, RootState> = {
    getSurvey (state) {
        return state.survey;
    },
    getOpenModal (state) {
        return state.openEmotions;
    },
    getCommentBox (state) {
        return state.commentBox;
    },
    getPhoneNumber (state) {
        return state.phoneNumber;
    },
    getActiveEmotion (state): unknown {
        return state.sentiments;
    },
};
