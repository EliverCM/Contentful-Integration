<template>
    <div class="columns is-news is-accordion is-multiline">
        <div class="column" :class="[collapse ? 'is-12' : 'is-3']">
            <p class="a">{{ dateCreatedAt }}</p>
            <p class="has-text-grey">{{ hourCreatedAt }}</p>
        </div>
        <div class="column">
            <p class="title">{{ news.fields.title }}</p>
            <div class="columns is-mobile">
                <div
                    class="column"
                    v-if="news.fields.geoSource || news.fields.category"
                >
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
            <ul>
                <li
                    v-for="entry in news.fields.entries"
                    :key="entry.id"
                    :class="{ open: isOpen(entry) }"
                >
                    <button @click="open(entry)">
                        <svg
                            v-if="isOpen(entry)"
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 0 24 24"
                            width="24px"
                            fill="#000000"
                        >
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path
                                d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z"
                            />
                        </svg>
                        <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 0 24 24"
                            width="24px"
                            fill="#000000"
                        >
                            <path
                                d="M24 24H0V0h24v24z"
                                fill="none"
                                opacity=".87"
                            />
                            <path
                                d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"
                            />
                        </svg>
                    </button>
                    <div class="pair">
                        <p class="title">{{ entry.key }}</p>
                        <p class="body">{{ entry.value }}</p>
                    </div>
                </li>
            </ul>
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
import moment from 'moment';
import { defineComponent, ref, onMounted, PropType } from 'vue';
import GiveLike from '@/components/Like.vue';
import useShort from '../composables/useShort';

export default defineComponent({
    name: 'AccordionShort',
    components: { GiveLike },
    props: {
        news: { type: Object as PropType<any>, required: true },
        collapse: Boolean,
    },

    setup (props, { emit }) {

        const {
            dateCreatedAt, hourCreatedAt, details, selectGeoSource,
            selectCategory
        } = useShort(props, emit);

        const selected = ref(null);

        onMounted(() => {
            selected.value = props.news.fields.entries[0].id;
        });

        const isOpen = (entry: any) => {
            let isOpen = false;
            if (entry.id == selected.value) {
                isOpen = true;
            }
            return isOpen;
        };

        const open = (entry: any) => {
            selected.value = entry.id;
        };

        return {
            selected, moment, isOpen, open, dateCreatedAt, hourCreatedAt, details,
            selectGeoSource, selectCategory
        };
    }


});
</script>

<style lang="scss" scoped>
</style>
