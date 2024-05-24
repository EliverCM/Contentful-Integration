import usePipeMoment from '@/composables/pipeMoment';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { NewsMutations } from '../store/mutations';
import { FilterTagsI } from '../store/types';

const useShort = (props: any, emit: any) => {
    
    // --- Variables
    const store = useStore();
    const { transformDates } = usePipeMoment();
    const dateCreatedAt = computed(() => transformDates(props.news.sys.createdAt, 'MMMM DD, YYYY'));
    const hourCreatedAt = computed(() => transformDates(props.news.sys.createdAt, 'HH:mm:ss'));
    const filterTags = computed<FilterTagsI>(() => store.getters['NEWS/getFilterTags']);

    // --- Functions
    const details = () => emit('details');

    const selectGeoSource = (geoSource: string) => {
        const tags = { ...filterTags.value };

        // const exist = tags.geoSource === geoSource;
        // if (exist) {
        //     tags.geoSource = '';
        // } else {
        //     tags.geoSource = geoSource;
        // }

        const exist = tags.geoSource.some((element) => element === geoSource);
        if (exist) {
            tags.geoSource = tags.geoSource.filter( element => element !== geoSource);
        } else {
            tags.geoSource.push(geoSource);
        }

        store.commit(`NEWS/${NewsMutations.SET_FILTERTAGS}`, tags, { root: true });
    };

    const selectCategory = (category: string) => {

        const tags = { ...filterTags.value };
        // tags.category =  tags.category !== category ? tags.category : '';
        // console.log('category :>> ', tags.category);
        
        // const exist = tags.category === category;
        // if (exist) {
        //     tags.category = '';
        // } else {
        //     tags.category = category;
        // }

        const exist = tags.category.some((element) => element === category);
        if (exist) {
            tags.category = tags.category.filter( element => element !== category);
        } else {
            tags.category.push(category);
        }
        
        store.commit(`NEWS/${NewsMutations.SET_FILTERTAGS}`, tags, { root: true });
    };

    // --- Returns
    return {
        dateCreatedAt, hourCreatedAt, details, selectGeoSource,
        selectCategory
    };
};

export default useShort;
