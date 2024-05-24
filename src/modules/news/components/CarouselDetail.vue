<template>
    <div class="columns is-news is-carousel is-multiline">
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
            <div class="columns is-mobile is-image-control">
                <div class="column">
                    <button class="button min-width-100" @click="prev">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 0 24 24"
                            width="24px"
                            fill="#000000"
                        >
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path
                                d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"
                            />
                        </svg>
                    </button>
                </div>
                <div class="column">
                    <button class="button min-width-100" @click="next">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 0 24 24"
                            width="24px"
                            fill="#000000"
                        >
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path
                                d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <figure class="image is-main-image">
                <img
                    :src="
                        news.fields.image[this.current].fields.file.url +
                        '?w=1003'
                    "
                    alt=""
                />
            </figure>
            <a
                v-if="news.fields.externalLink"
                :href="news.fields.externalLink"
                target="_blank"
                class="button is-external-link"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    fill="#000000"
                >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path
                        d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"
                    />
                </svg>
            </a>
            <div id="images" class="images">
                <figure
                    v-for="(image, i) in news.fields.image"
                    :key="image.sys.id"
                    class="image"
                >
                    <img
                        :src="image.fields.file.url + '?h=180'"
                        :alt="image.fields.description"
                        @click="display(i)"
                    />
                </figure>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import moment from 'moment';
import { computed, defineComponent, PropType, ref } from 'vue';
import GiveLike from '@/components/Like.vue';
import usePipeMoment from '@/composables/pipeMoment';

export default defineComponent({
    name: 'CarouselDetail',
    components: { GiveLike },
    props: {
        news: { type: Object as PropType<any>, require: true }
    },

    setup (props) {
        const { transformDates } = usePipeMoment();
        const current = ref(0);
        const dateUpdateAt = computed(() => transformDates(props.news.sys.updatedAt, 'MMMM DD, YYYY'));
        const hourUpdateAt = computed(() => transformDates(props.news.sys.updatedAt, 'HH:mm:ss'));

        const prev = () => {
            let count = current.value;

            count--;

            if (count < 0) {
                count = props.news.fields.image.length - 1;
            }

            current.value = count;
        };

        const next = () => {
            let count = current.value;
            count++;

            if (count >= props.news.fields.image.length) {
                count = 0;
            }

            current.value = count;
        };

        const display = (count: number) => {
            current.value = count;
        };

        return {
            current, moment, prev, next, display, dateUpdateAt, hourUpdateAt
        };
    }

});
</script>

<style lang="scss" scoped>
.title {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 3rem;
}
#images.images {
    // flex-wrap: wrap;
    // justify-content: space-between;
    // justify-content: center;
    gap: 2rem;
    // overflow: scroll;

    figure.image {
        background: rgba(255, 0, 130, 0.2);
        margin-bottom: 2rem;
        margin: 0;

        img {
            cursor: pointer;
            height: 120px;
            transition: transform 0.3s;

            &:hover {
                transform: scale(1.04);
            }
        }
    }
}

.min-width-100 {
    min-width: 100%;
}
</style>
