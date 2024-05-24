<template>
    <div v-if="!loading">
        <!-- back functionality -->
        <div class="buttons mb-6 pt-6">
            <button
                class="button is-pink is-light is-wide has-text-left"
                @click="backPage"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    fill="#ffffff"
                >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                    />
                </svg>
            </button>
        </div>

        <!-- news body -->
        <component
            :is="componentName"
            :news="news"
            v-if="initialized"
        ></component>
    </div>

    <div v-else>
        <Wait />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import moment from 'moment';
import { useStore } from 'vuex';
import { socketClient } from '@/sockets/socketio';
import { documentToHtmlString, Options } from '@contentful/rich-text-html-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import { NewsMutations } from '@/modules/news/store/mutations';
import { Menu } from '@/modules/user/store/types';
import Wait from '@/components/Wait.vue';
import ArticleDetail from '@/modules/news/components/ArticleDetail.vue';
import AccordionDetail from '@/modules/news/components/AccordionDetail.vue';
import CarouselDetail from '@/modules/news/components/CarouselDetail.vue';

export default defineComponent({
    name: 'NewsDetail',
    props: {
        entry: { type: Object, default: null },
    },
    emits: ['backPage'],
    components: {
        Wait,
        ArticleDetail,
        AccordionDetail,
        CarouselDetail,
    },

    setup (props, { emit }) {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        const news = ref<any>({});
        const componentName = ref();
        const today = ref(moment().format('dddd, MMMM DD YYYY'));

        const initialized = computed(() => store.state.initialized);
        const hasMenuAdmin = computed(() => store.state.user.menu.some((menuItem: Menu) => menuItem.description.toLowerCase() === 'admin'));
        const rooms = computed<Array<string>>(() => store.getters['NEWS/getRooms']);

        const privacyOptions: Partial<Options> = {
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

        const loading = ref(false);


        const getDetails = async () => {

            loading.value = props.entry ? false : true;
            try {
                const res = props.entry || await store.dispatch('NEWS/getEntryDetails', { idEntry: route.params.id });
                const body = res.fields.body || res.fields.description;
                const image = res.fields.hero || res.fields.image;

                res.fields.bodyHtml = documentToHtmlString(body, privacyOptions);
                res.fields.hero = image;
                news.value = res;

                const likesGlobal = computed(() => store.getters['NEWS/getLikes']);
                const reaction = await store.dispatch('NEWS/getReactions', [res.sys.id]);

                if (likesGlobal.value.length) {
                    const index = likesGlobal.value.findIndex((x: any) => x.idcontent === res.sys.id);
                    likesGlobal.value[index] = reaction[0];
                } else {
                    store.commit(`NEWS/${NewsMutations.SET_LIKES}`, reaction, { root: true });
                }
            } catch (err) {
                console.error(`Error get details entry: ${route.params.id}`, err);
            }

            const contentTypes = {
                myTpNews: 'article-detail',
                myTpNewsAccordion: 'accordion-detail',
                myTpNewsImageCarousel: 'carousel-detail',
                myTpNewsCoupons: 'article-detail',
                myTpNewsBenefits: 'article-detail',
            };

            const name = contentTypes[news.value.sys.contentType.sys.id as keyof typeof contentTypes];
            componentName.value = name;
            loading.value = false;
        };

        const noExistRoom = rooms.value.some(room => room === route.params.id);

        if (!noExistRoom) {
            socketClient.emit('joinRoom', [route.params.id]); //join room event requires entry's id
            rooms.value.push(route.params.id as string);
            store.commit(`NEWS/${NewsMutations.SET_ROOMS}`, rooms.value);
        }

        const backPage = () => {
            const routesAvailables = {
                NewsDetail: 'Home',
                benefitsDetail: 'Benefits',
                couponsDetail: 'Coupons',
            };
            const backTo = routesAvailables[route.name as keyof typeof routesAvailables];

            if (props.entry) emit('backPage');
            else router.push({ name: backTo });
        };


        // --- Initialized functions
        getDetails();

        return {
            news, componentName, moment, initialized, hasMenuAdmin, today,
            backPage, loading
        };

    }

});
</script>

<style lang="scss" scoped>
.custom-modal {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(10, 10, 10, 0.86);
    width: 100vw;
    height: 100%;
    z-index: 30;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.card-active {
    transition: transform 0.5s ease;
    transform: translateY(-105%);
}

.modal-active {
    opacity: 1;
}

.card-out {
    transform: translateY(105%);
    transition: transform 0.5s ease;
}

.modal-out {
    opacity: 0;
    transition: opacity 0.5s ease;
}

.card {
    border-radius: 12px 12px 0 0;
    height: 95vh;
    width: 100vw;
    position: absolute;
    bottom: -100%;
    overflow: auto;
    /* transform: translateY(0); */
}
</style>
