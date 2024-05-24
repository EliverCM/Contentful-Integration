import { api } from '@/api/mytp';
import { EventsRequest } from '@/modules/calendar/store/types';
import { Like, ParamsGetAllNewsI } from '@/modules/news/store/types';

export default {

    async getAllNews (payload: ParamsGetAllNewsI) {
        const params: any = {
            page: payload.page || 1,
            size: payload.size || 5,
            orderByCreationDate: payload.orderByCreationDate || 'desc',
            ...payload
        };

        if (payload.orderByCreationDate === '') delete params.orderByCreationDate;
        if (payload.orderByUpdateDate === '') delete params.orderByUpdateDate;
        if (payload.geoSource?.toString() === '') delete params.geoSource;
        if (payload.category?.toString() === '') delete params.category;
        delete params.newsType;

        if (params.geoSource) params.geoSource = params.geoSource.toString();
        if (params.category) params.category = params.category.toString();

        return (await api.get(payload.newsType, { params }));
    },

    async getEntryDetails (idEntry: string) {
        return (await api.get(`news/${idEntry}`));
    },

    async giveLike (payload: Like) {
        return api.post(`news/${payload.id}/reaction`, { emotion: payload.reaction });
    },
    async getReactions (ids: Array<string>) {
        return api.post('reactions', {
            contents: ids
        });
    },

    async getEvents (payload: EventsRequest) {
        return (await api.get('events', { params: { startDate: payload.start, endDate: payload.end } })).data;
    }
};
