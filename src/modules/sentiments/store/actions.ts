import { ActionTree, useStore } from 'vuex';
import { RootState } from '@/store/types';
import { SentimentsMutations } from '@/modules/sentiments/store/mutations';
import sentiments from '@/api/sentiments';
import { SentimentsState, SentSurvey } from '@/modules/sentiments/store/types';
import { UserMutations } from '@/modules/user/store/mutations';

export const actions: ActionTree<SentimentsState, RootState> = {
    async getEmotionsList () {
        const emotions = (await sentiments.getEmotionList()).data;
        return emotions;
    },

    async getReasons () {
        const reasons = (await sentiments.getReasons()).data;
        return reasons.results;
    },

    async getTpClient () {
        const canCreate = (await sentiments.getTpClient()).data;
        return canCreate.result;
    },

    async sendSurvey (context, survey: SentSurvey) {
        const sendSurvey = (await sentiments.sendSurvey(survey)).data;
        return sendSurvey;
    },

    openEmotions ({commit}, val) {
        commit(`${SentimentsMutations.SET_OPEN_EMOTIONS}`, val);
    },
    //Sentiments
    async syncEmotions ({ commit }) {
        const sync = (await sentiments.syncSentiments()).data;
        if(sync){
            commit(`SENTIMENTS/${SentimentsMutations.SET_SENTIMENTS}`, sync, { root: true });
        }
    },
    async getParameters ({ commit }, paramNumber = 0) {
        const parameters = (await sentiments.getParameters()).data;
        commit(`SENTIMENTS/${SentimentsMutations.SET_PARAMETERS}`, parameters.arguments, { root: true });
        const filterSurvey = parameters.arguments.filter((param: any) => param.idparameter === 1)[0];
        const filterComment = parameters.arguments.filter((param: any) => param.idparameter === 3)[0];
        const phoneNumber = parameters.arguments.filter((param: any) => param.idparameter === 2)[0];
        if(filterSurvey){
            if (filterSurvey.value === '0') {
                commit(`SENTIMENTS/${SentimentsMutations.SET_SURVEY}`, false, { root: true });
            } else {
                commit(`SENTIMENTS/${SentimentsMutations.SET_SURVEY}`, true, { root: true });
            }
        }
        if(filterComment){
            if(filterComment.value === '0'){
                commit(`SENTIMENTS/${SentimentsMutations.SET_COMMENT_BOX}`, false, { root: true });
            }else{
                commit(`SENTIMENTS/${SentimentsMutations.SET_COMMENT_BOX}`, true, { root: true });
            }
        }
        //phone number
        if(phoneNumber){
            if(phoneNumber.value){
                commit(`SENTIMENTS/${SentimentsMutations.SET_PHONE_NUMBER}`, phoneNumber.value, { root: true });
            }
        }
        const filter = parameters.arguments.filter((param: any) => param.id === paramNumber);
        let result;
        if (filter.length) {
            result = filter[0];
        } else {
            result = undefined;
        }
        return result;
    },
};
