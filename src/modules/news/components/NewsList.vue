<template>
    <div class="is-flex is-align-items-baseline is-justify-content-end mb-6">
        <div class="is-relative">
            <span
                v-if="filtersList.length"
                class="icon-text mr-4 is-clickable"
                :class="{ 'has-text-pink': showFilters }"
                @click="!showFilters ? (showFilters = true) : cancelFilters()"
            >
                <span>{{$t('MYINTEREST.news.components.NewsList.categories')}}</span>
                <span class="icon">
                    <fa icon="filter" />
                </span>
            </span>

            <div v-if="showFilters" class="box filter-list">
                <ul>
                    <li v-for="filter in filtersList" :key="filter.type">
                        <ul>
                            <li class="filter-list-title block">
                                {{ filter.type }}
                            </li>
                            <li
                                v-for="item in filter.list"
                                :key="item.name"
                                class="my-2"
                            >
                                <Checkbox
                                    status="primary"
                                    v-model="filtersSelect"
                                    :value="{
                                        name: item.name,
                                        type: filter.type,
                                    }"
                                    name="filters"
                                >
                                    {{ item.name }}
                                </Checkbox>
                            </li>
                        </ul>
                    </li>
                </ul>
                <hr />
                <div class="is-flex is-justify-content-space-between">
                    <button class="button primary" @click="cancelFilters">
                        {{$t('MYINTEREST.news.components.NewsList.cancel')}}
                    </button>
                    <button
                        class="button is-pink"
                        @click="saveFilters(filtersSelect)"
                    >{{$t('MYINTEREST.news.components.NewsList.save')}}
                    </button>
                </div>
            </div>
        </div>

        <div class="select is-thick has-icon">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                <path d="M3 18V16H9V18ZM3 8V6H21V8ZM3 13V11H15V13Z" />
            </svg>
            <select @change="selectOrder($event)">
                <option value="1">{{$t('MYINTEREST.news.components.NewsList.newestfirst')}}</option>
                <option value="2">{{$t('MYINTEREST.news.components.NewsList.oldestfirst')}}</option>
                <option value="3">{{$t('MYINTEREST.news.components.NewsList.updatenewestfirst')}}</option>
                <option value="4">{{$t('MYINTEREST.news.components.NewsList.updateoldestfirst')}}</option>
            </select>
        </div>
    </div>

    <!-- news -->
    <div id="infinite-list">
        <section v-if="!myInterestsNews.length && !isLoading" class="section">
            <h1 class="title">{{$t('MYINTEREST.news.components.NewsList.noitemsfound')}}</h1>
        </section>

        <div v-for="entry in myInterestsNews" :key="entry.sys.id">
            <component
                :is="componentType(entry)"
                :news="entry"
                @details="openDetails(entry)"
            ></component>
        </div>

        <section v-if="myInterestsNews.length">
            <p
                v-if="!hasNewNews && !loadingScroll"
                class="has-text-centered has-text-dark noItems"
            >{{$t('MYINTEREST.news.components.NewsList.nomoreitems')}}
            </p>

            <div v-if="loadingScroll" class="loadingScroll">
                <div class="loaderScroll">{{$t('MYINTEREST.news.components.NewsList.loading')}}</div>
            </div>
        </section>

        <Wait v-if="!myInterestsNews.length && isLoading" />
    </div>

    <!-- Modal Details -->
    <FullModal v-if="showDetails && selectedEntry" @close="closeModal">
        <NewsDetail :entry="selectedEntry" @backPage="closeModal" />
    </FullModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { socketClient } from '@/sockets/socketio';
import moment from 'moment';

import Wait from '@/components/Wait.vue';
import NewsDetail from '../views/NewsDetail.vue';
import ArticleShort from '@/modules/news/components/ArticleShort.vue';
import AccordionShort from '@/modules/news/components/AccordionShort.vue';
import CarouselShort from '@/modules/news/components/CarouselShort.vue';
import FullModal from '@/components/FullModal.vue';
import { FilterSelectedI, FiltersI, FilterTagsI, ParamsGetAllNewsI } from './../store/types';
import Multiselector from '@/components/Multiselector.vue';
import { NewsMutations } from '../store/mutations';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'NewsList',
    components: {
        Wait,
        NewsDetail,
        ArticleShort,
        AccordionShort,
        CarouselShort,
        FullModal,
        Multiselector
    },
    props: {
        newsType: { type: String, default: 'News', required: true },
    },
    setup (props) {
        // --- VARIABLES
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        const i18n = useI18n();
        const today = ref(moment().format('dddd, MMMM DD YYYY'));
        const showDetails = ref(false);
        const selectedEntry = ref({});
        const loadingScroll = ref(false);
        const hasNewNews = ref(true);
        const selectCreatedOrder = ref('desc');
        const selectUpdatedOrder = ref('');

        const listElm = document.querySelector('body') as HTMLElement;
        let counterPagination = 1;
        let currentPage = 1;

        const filtersSelect = ref<Array<FilterSelectedI>>([]);
        const showFilters = ref(false);
        const filterTypes = {
            category: 'CATEGORY OPTIONS',
            geoSource: 'GEO SOURCE',
        };

        // --- FUNCTIONS
        const filtersList = computed((): Array<FiltersI> => store.getters['NEWS/getFilters']);
        const myInterestsNews = computed((): Array<any> => {
            let res = [];
            if (props.newsType === 'News') {
                res = store.getters['NEWS/getNews'];
            } else if (props.newsType === 'Coupons') {
                res = store.getters['NEWS/getCoupons'];
            } else {
                res = store.getters['NEWS/getBenefits'];
            }
            return res;
        });

        const isLoading = computed(() => store.state.NEWS.loading);
        const hasFilters = computed(() => store.getters['NEWS/hasFilters']);
        const filters = computed(() => store.getters['NEWS/getFilterTags']);
        const loading = (value: boolean) => store.commit(`NEWS/${NewsMutations.SET_LOADING}`, value);

        const getNews = async (params?: ParamsGetAllNewsI): Promise<Array<any>> => {

            params = {
                ...params,
                newsType: props.newsType,
                geoSource: params?.geoSource || filters.value?.geoSource || '',
                category: params?.category || filters.value?.category || '',
                orderByCreationDate: params?.orderByCreationDate || selectCreatedOrder.value,
                orderByUpdateDate: params?.orderByUpdateDate || selectUpdatedOrder.value
            };

            if (props.newsType !== 'News') {
                delete params.geoSource;
                delete params.category;
            }

            try {
                return await store.dispatch('NEWS/getAllNews', params);
            } catch (error) {
                console.error(`Error GET ${props.newsType}`, error);
                return [];
            }
        };

        const getReactions = async () => {
            try {
                const idsNews = myInterestsNews.value.map(element => element.sys.id);
                const reactions = await store.dispatch('NEWS/getReactions', idsNews);
                store.commit(`NEWS/${NewsMutations.SET_LIKES}`, reactions, { root: true });
            } catch (error) {
                console.error('Error get reactions', error);
            }
        };

        const joinRoomReactions = () => {
            const idsNews = myInterestsNews.value.map(element => element.sys.id);
            if (idsNews.length) {
                socketClient.emit('joinRoom', idsNews); //join room event requires entry's id
                store.commit(`NEWS/${NewsMutations.SET_ROOMS}`, idsNews);
            }
        };

        const getQueryParams = () => {
            const category = route.query.category?.toString() || '';
            const geoSource = route.query.geoSource?.toString() || '';
            const filters = {
                category: category.split(','),
                geoSource: geoSource.split(',')
            };
            store.commit(`NEWS/${NewsMutations.SET_FILTERTAGS}`, filters, { root: true });
        };

        const componentType = (entry: any) => {
            let type;
            switch (entry.sys.contentType.sys.id) {
                case 'myTpNews':
                    type = 'article-short';
                    break;
                case 'myTpNewsImageCarousel':
                    type = 'carousel-short';
                    break;
                case 'myTpNewsAccordion':
                    type = 'accordion-short';
                    break;

                case 'myTpNewsCoupons':
                    type = 'article-short';
                    break;

                case 'myTpNewsBenefits':
                    type = 'article-short';
                    break;
            }
            return type;
        };

        const addQueryParamsUrl = async () => {
            const category = filters.value.category.toString();
            const geoSource = filters.value.geoSource.toString();

            if (category === '' && geoSource === '')
                await router.replace({ query: undefined });
            else
                await router.replace({ query: { category, geoSource } });
        };

        const getFiltersSelected = () => {
            const categories = filters.value?.category.map((filter: FilterSelectedI) => ({ name: filter, type: filterTypes.category }));
            const geoSources = filters.value?.geoSource.map((filter: FilterSelectedI) => ({ name: filter, type: filterTypes.geoSource }));
            filtersSelect.value = [...categories, ...geoSources];
            addQueryParamsUrl();
        };

        const validateFilters = (): boolean => {
            const hasQueryParams = !!Object.entries(route.query).length;
            if (hasQueryParams && !hasFilters.value) {
                getQueryParams();
                return false;
            }
            if (filtersList.value.length) getFiltersSelected();
            return true;
        };


        const getDataCurrentNewsType = () => {
            const pages = store.getters['NEWS/getCurrentPages'];
            let page = 0;
            let mutation = '';

            if (props.newsType === 'News') {
                mutation = NewsMutations.SET_NEWS;
                page = pages.news;
            };
            if (props.newsType === 'Coupons') {
                mutation = NewsMutations.SET_COUPONS;
                page = pages.coupons;
            };
            if (props.newsType === 'Benefits') {
                mutation = NewsMutations.SET_BENEFITS;
                page = pages.benefits;
            };

            return { page, mutation };
        };

        const updatePagesInNewsType = () => {
            const pages = store.getters['NEWS/getCurrentPages'];
            pages[props.newsType.toLowerCase()] = counterPagination;
            store.commit(`NEWS/${NewsMutations.SET_CURRENT_PAGES}`, pages, { root: true });
        };

        const loadNews = async (init = false) => {
            loading(true);
            loadingScroll.value = true;

            if (!validateFilters()) return;

            const newsType = getDataCurrentNewsType();
            if (newsType.page) counterPagination = newsType.page;
            if (myInterestsNews.value.length && init) {
                currentPage = newsType.page;
                loadingScroll.value = false;
                return;
            } else {
                updatePagesInNewsType();
            }
            if (myInterestsNews.value.length) counterPagination++;

            const params: ParamsGetAllNewsI = {
                newsType: props.newsType,
                page: counterPagination,
                category: filters.value?.category || '',
                geoSource: filters.value?.geoSource || ''
            };

            const news = await getNews(params);

            if (news.length) {
                hasNewNews.value = true;

                if (myInterestsNews.value.length) {
                    setTimeout(() => listElm.scrollTo(0, listElm.scrollTop + 150), 100);
                }

                const mapNews = news.map(myNews => {
                    if (props.newsType === 'Coupons' || props.newsType === 'Benefits') {
                        myNews.fields.body = myNews.fields.body || myNews.fields.description;
                        myNews.fields.hero = myNews.fields.hero || myNews.fields.image;
                        delete myNews.fields.category;
                        delete myNews.fields.geoSource;
                    }
                    return myNews;
                });

                const newsList = [...myInterestsNews.value, ...mapNews];
                
                updatePagesInNewsType();
                store.commit(`NEWS/${newsType.mutation}`, newsList, { root: true });

                if (props.newsType === 'News') {
                    await getReactions();
                    joinRoomReactions();
                }

                currentPage = counterPagination;
            } else {
                counterPagination = currentPage;
                hasNewNews.value = false;
            }

            setTimeout(() => (loadingScroll.value = false), 3000);
            loading(false);
        };

        const openDetails = (entry: any) => {
            const urlName = props.newsType.toLowerCase();
            showDetails.value = true;
            selectedEntry.value = entry;
            window.history.replaceState(history.state, '', `${urlName}/${entry.sys.id}`);
        };

        const closeModal = () => {
            showDetails.value = false;
            window.history.replaceState(history.state, '', `${history.state.current}`);
        };

        const filterNews = () => {
            counterPagination = 1;
            listElm.scrollTop = 0;
            if (props.newsType === 'News') store.commit(`NEWS/${NewsMutations.SET_NEWS}`, [], { root: true });
            if (props.newsType === 'Benefits') store.commit(`NEWS/${NewsMutations.SET_BENEFITS}`, [], { root: true });
            if (props.newsType === 'Coupons') store.commit(`NEWS/${NewsMutations.SET_COUPONS}`, [], { root: true });
            loadNews();
        };

        const selectOrder = (order: any) => {
            switch (Number(order.target.value)) {
                case 1:
                    selectCreatedOrder.value = 'desc';
                    selectUpdatedOrder.value = '';
                    break;
                case 2:
                    selectCreatedOrder.value = 'asc';
                    selectUpdatedOrder.value = '';
                    break;
                case 3:
                    selectCreatedOrder.value = '';
                    selectUpdatedOrder.value = 'desc';
                    break;
                case 4:
                    selectCreatedOrder.value = '';
                    selectUpdatedOrder.value = 'asc';
                    break;
            }
            filterNews();
        };

        const handlerEventScroll = async () => {
            const heightLimit = listElm.scrollHeight - listElm.scrollTop - window.innerHeight;
            if (heightLimit <= 100 && !loadingScroll.value) {
                await loadNews();
            }
        };

        const closeFilterList = () => {
            showFilters.value = false;
        };

        // --- FUNCTIONS filter
        const updateFilters = (filters: FilterTagsI) => {
            store.commit(`NEWS/${NewsMutations.SET_FILTERTAGS}`, filters, { root: true });
        };

        const saveFilters = (selected: Array<FilterSelectedI>) => {

            const categories = selected.filter(item => item.type === filterTypes.category).map(item => item.name);
            const geoSources = selected.filter(item => item.type === filterTypes.geoSource).map(item => item.name);

            const filters: FilterTagsI = {
                category: categories,
                geoSource: geoSources
            };

            updateFilters(filters);
            closeFilterList();
        };

        const cancelFilters = () => {
            if (filtersList.value.length) getFiltersSelected();
            closeFilterList();
        };



        onMounted(() => {
            listElm.scrollTop = 0;
            listElm.addEventListener('scroll', handlerEventScroll);
        });

        onUnmounted(() => {
            listElm.removeEventListener('scroll', handlerEventScroll);
        });


        watch(filters, async () => {
            if (props.newsType === 'News') {
                await addQueryParamsUrl();
                filterNews();
            }
        });

        // --- Initialized functions
        loadNews(true);

        // --- RETURN
        return {
            //  VARIABLES
            today,
            showDetails,
            selectedEntry,
            loadingScroll,
            hasNewNews,

            // FUNCTIONS
            myInterestsNews,
            isLoading,
            componentType,
            openDetails,
            closeModal,
            filterNews,
            addQueryParamsUrl,
            selectOrder,
            handlerEventScroll,
            saveFilters,
            filtersSelect,
            showFilters,
            cancelFilters,

            // AsideMenu composable
            filtersList,
            i18n
        };
    }
});
</script>

<style lang="scss" scoped>
.loadingScroll {
    position: absolute;
    bottom: -88px;
    color: white;
    z-index: 1;
    width: 100%;
    height: 40px;
    border-radius: 15px 15px 0px 0px;
}

.noItems {
    position: absolute;
    bottom: -88px;
    // color: white;
    z-index: 1;
    width: 100%;
    height: 40px;
}

// --- loaderScroll
.loaderScroll:before,
.loaderScroll:after,
.loaderScroll {
    border-radius: 50%;
    width: 1.5em;
    height: 1.5em;
    animation-fill-mode: both;
    animation: load7 1.8s infinite ease-in-out;
}
.loaderScroll {
    margin: 0 auto;
    font-size: 10px;
    position: relative;
    text-indent: -9999em;
    animation-delay: 0.16s;
    top: -15px;
}
.loaderScroll:before {
    left: -2.5em;
}
.loaderScroll:after {
    left: 2.5em;
    animation-delay: 0.32s;
}
.loaderScroll:before,
.loaderScroll:after {
    content: "";
    position: absolute;
    top: 0;
}
@-webkit-keyframes load7 {
    0%,
    80%,
    100% {
        box-shadow: 0 2.5em 0 -1.3em rgba(255, 0, 130, 0.6);
    }
    40% {
        box-shadow: 0 2.5em 0 0 rgba(255, 0, 130, 0.6);
    }
}
@keyframes load7 {
    0%,
    80%,
    100% {
        box-shadow: 0 2.5em 0 -1.3em rgba(255, 0, 130, 0.6);
    }
    40% {
        box-shadow: 0 2.5em 0 0 rgba(255, 0, 130, 0.6);
    }
}

.filter-list {
    position: absolute;
    top: 25px;
    right: 16px;
    width: 300px;
    z-index: 2;
}

.filter-list-title {
    font-weight: bold;
    margin-top: 25px;

    &:first-child {
        margin-top: auto;
    }
}
</style>
