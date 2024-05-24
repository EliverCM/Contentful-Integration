import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { Like, NewsState } from './types';
import apiContentful from '@/api/apiContentful';
import { NewsMutations } from './mutations';
import { documentToHtmlString, Options } from '@contentful/rich-text-html-renderer';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import { BLOCKS } from '@contentful/rich-text-types';

// custom render options to be passed in to contentful's documentToHtmlString
// will render inline images and inline videos inside of a rich text area
// the way I want them rendered
const renderOptions: Partial<Options> = {
    renderNode: {
        [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
            // defining how to render inline images
            if (node.data.target.fields?.file.contentType.startsWith('image')) {
                return '<img src="' + node.data.target.fields.file.url + '" />';
                // defining how to render inline videos
            } else if (node.data.target.fields?.file.contentType.startsWith('video')) {
                return '<video controls><source src="' + node.data.target.fields.file.url + '" type="' + node.data.target.fields.file.contentType + '" /></video>';
            } else {
                return '';
            }
        }
    }
};

export const actions: ActionTree<NewsState, RootState> = {

    async getAllNews (_, payload) {
        const res = (await apiContentful.getAllNews(payload)).data
            .map((response: any) => {
                if (response.fields.body) {
                    response.fields.bodyHtml = documentToHtmlString(response.fields.body, renderOptions);
                    response.fields.bodyPlain = documentToPlainTextString(response.fields.body);
                } else if (response.fields.description) {
                    response.fields.bodyHtml = documentToHtmlString(response.fields.description, renderOptions);
                    response.fields.bodyPlain = documentToPlainTextString(response.fields.description);
                }
                return response;
            });
        return res;
    },

    async getEntryDetails (_, payload: { idEntry: string }) {
        return (await apiContentful.getEntryDetails(payload.idEntry)).data;
    },

    async giveLike (_, payload: Like) {
        return (await apiContentful.giveLike(payload)).data;
    },

    async getReactions (_, ids: Array<string>) {
        return (await apiContentful.getReactions(ids)).data;
    },

    async updateLikes ({ commit, rootGetters }, payload) {
        const allLikes = rootGetters['NEWS/getLikes'];
        const findContent = allLikes.findIndex((component: { idcontent: number }) => component.idcontent === payload.idcontent);
        allLikes[findContent].likes = payload.likes;
        allLikes[findContent].reacted = payload.reacted;
        commit(`NEWS/${NewsMutations.SET_LIKES}`, allLikes, { root: true });
    },
};
