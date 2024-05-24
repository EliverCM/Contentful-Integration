import { api } from '@/api/mytp';
import { ParamsGetAllNewsI } from '@/modules/news/store/types';

export default {
    //get benefits
    async getBenefits (payload: ParamsGetAllNewsI) {
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

        return (await api.get('benefits', { params }));
    }
};
