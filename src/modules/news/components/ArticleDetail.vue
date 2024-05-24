<template>
    <div v-if="news" class="columns is-news is-article is-multiline">
        <div class="column is-12">
            <p class="title">{{ news.fields.title }}</p>
        </div>
        <div class="column is-3">
            <p class="a">{{ dateUpdateAt }}</p>
            <p class="has-text-grey">{{ hourUpdateAt }}</p>
        </div>
        <div class="column">
            <!-- <p class="title">{{ news.fields.title }}</p> -->
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
                <img :src="news.fields.hero.fields.file.url" alt="" />
            </figure>
            <div class="content mt-6" v-html="news.fields.bodyHtml"></div>
        </div>
    </div>
</template>

<script lang="ts">
import moment from 'moment';
import { computed, defineComponent, PropType } from 'vue';
import GiveLike from '@/components/Like.vue';
import usePipeMoment from '@/composables/pipeMoment';

export default defineComponent({
    name: 'ArticleDetail',
    components: { GiveLike },
    props: {
        news: { type: Object as PropType<any>, required: true },
    },

    setup (props) {
        const { transformDates } = usePipeMoment();
        const dateUpdateAt = computed(() => transformDates(props.news.sys.updatedAt, 'MMMM DD, YYYY'));
        const hourUpdateAt = computed(() => transformDates(props.news.sys.updatedAt, 'HH:mm:ss'));
        return { moment, dateUpdateAt, hourUpdateAt };
    },
});
</script>

<style lang="scss" scoped>
.title {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 3rem;
}
</style>
