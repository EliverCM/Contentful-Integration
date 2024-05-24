import { Module } from 'vuex';
import { SentimentsState } from '@/modules/sentiments/store/types';
import { RootState } from '@/store/types';
import { mutations } from '@/modules/sentiments/store/mutations';
import { getters } from '@/modules/sentiments/store/getters';
import { actions } from '@/modules/sentiments/store/actions';

export const SENTIMENTS: Module<SentimentsState, RootState> = {
    namespaced: true,
    state: {
        survey: false,
        scores: null,
        openEmotions: false,
        commentBox: false,
        phoneNumber: '',
        parameters: null,
        sentiments: {
            datetimecreated: '',
            descEmotion: '',
            emotion: 0
        },
    },
    mutations,
    getters,
    actions,
};
