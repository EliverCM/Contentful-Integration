<template>
    <div class="columns is-news is-article is-multiline">
        <div class="column" :class="[collapse ? 'is-12' : 'is-3']">
            <p class="a">{{ dateCreatedAt }}</p>
            <p class="has-text-grey">{{ hourCreatedAt }}</p>
        </div>
        <div class="column">
            <p class="title">{{ news.fields.title }}</p>
            <div
                class="columns is-mobile"
                v-if="news.fields.geoSource || news.fields.category"
            >
                <div class="column">
                    <p
                        v-if="news.fields.geoSource"
                        class="tag is-pink is-light"
                    >
                        {{ news.fields.geoSource }}
                    </p>
                    <p
                        v-if="news.fields.category"
                        class="tag is-pink is-light ml-2"
                    >
                        {{ news.fields.category }}
                    </p>
                </div>
                <div class="column is-narrow">
                    <GiveLike :id="news.sys.id" />
                </div>
            </div>
            <figure class="image">
                <img
                    :src="news.fields.hero.fields.file.url + '?w=1003'"
                    alt=""
                />
            </figure>
            <p class="brief">{{ bodyPlain }}</p>
            <div class="buttons is-right">
                <button class="button is-pink is-light" @click="details">
                    <svg
                        data-v-31394841=""
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                    >
                        <path
                            data-v-31394841=""
                            d="M0 0h24v24H0z"
                            fill="none"
                        ></path>
                        <path
                            data-v-31394841=""
                            fill="white"
                            d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
                        ></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import GiveLike from '@/components/Like.vue';
import useShort from '../composables/useShort';

export default defineComponent({
    name: 'ArticleShort',
    components: { GiveLike },
    props: {
        news: { type: Object, required: true },
        collapse: Boolean,
    },
    emits: ['details', 'tags'],
    setup (props, { emit }) {
        const {
            dateCreatedAt, hourCreatedAt, details, selectGeoSource,
            selectCategory
        } = useShort(props, emit);

        const bodyPlain = computed(() => props.news.fields.bodyPlain.substring(0, 400) + ' ...' || '');


        return {
            dateCreatedAt, hourCreatedAt, details, selectGeoSource, selectCategory,
            bodyPlain,
        };
    }

});
</script>

<style lang="scss" scoped>
</style>
