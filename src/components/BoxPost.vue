<template>
    <div class="columns is-news is-accordion is-multiline">
        <div class="column" :class="[collapse ? 'is-12' : 'is-3']">
            <p class="a">{{ dateCreatedAt }}</p>
            <p class="has-text-grey">{{ hourCreatedAt }}</p>
        </div>
        <div class="column">
            <p class="title">{{ data.fields.title }}</p>
            <figure class="image">
                <img :src="data.fields.image.fields.file.url+'?w=1003'" alt="" />
            </figure>
            <p>{{ bodyPlain }}</p>
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
import { defineComponent, PropType, computed} from 'vue';
import usePipeMoment from '@/composables/pipeMoment';

export default defineComponent({
    name: 'BoxPost',
    props: {
        data: { type: Object as PropType<any>, required: true },
        collapse: Boolean,
    },
    emits: ['details'],
    setup (props, {emit}){
        const { transformDates } = usePipeMoment();
        const dateCreatedAt = computed(() => transformDates(props.data.sys.createdAt, 'MMMM DD, YYYY'));
        const hourCreatedAt = computed(() => transformDates(props.data.sys.createdAt, 'HH:mm:ss'));
        const contentDescriptions = computed(() => {
            const contents = props.data.fields.description.content;
            let contentString = '';
            for(const content of contents){
                content.content.forEach((contentIn: any)=>{
                    contentString = contentString.concat(contentIn.value);
                });
            }
            return contentString;
        });
        const bodyPlain = computed(() => contentDescriptions.value.toString().substring(0, 400) + ' ...' || '');
        const details = () => emit('details');
        return {
            dateCreatedAt, hourCreatedAt, contentDescriptions, bodyPlain, details
        };
    }
});
</script>

<style lang="scss"></style>
