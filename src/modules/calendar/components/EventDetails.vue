<template>
    <div class="columns is-news is-article is-multiline">
        <div class="buttons mb-6 pt-6">
            <button
                class="button is-pink is-light is-wide has-text-left"
                @click="$emit('close')"
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
        <div class="column is-12">
            <p class="title">{{ event.title }}</p>
        </div>
        <div class="column is-3">
            <p><b>{{$t('MYINTEREST.calendar.components.EventDetails.start')}}&nbsp;</b>{{ start }}</p>
            <p><b>End:&nbsp;</b>{{ end }}</p>
            <div class="button is-pink" @click="downloadEvent()">
                {{$t('MYINTEREST.calendar.components.EventDetails.exportevent')}}
            </div>
        </div>
        <div class="column">
            <div class="columns is-mobile">
                <div class="column"></div>
                <div class="column is-narrow">
                    <GiveLike v-if="likesRequested" :id="event.id" />
                </div>
            </div>
            <figure class="image">
                <img :src="event.extendedProps.image" />
            </figure>
            <div class="content mt-6">
                <span v-html="descriptionWithWrap"></span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { EventInput } from '@fullcalendar/common';
import moment from 'moment';
import { socketClient } from '@/sockets/socketio';
import { computed, defineComponent, PropType, ref } from 'vue';
import GiveLike from '@/components/Like.vue';
import { useStore } from 'vuex';
import { Reaction } from '@/modules/news/store/types';
import { NewsMutations } from '@/modules/news/store/mutations';
import { CONSTANTS } from '@/constants/constants';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    components: { GiveLike },
    props: {
        event: { type: Object as PropType<EventInput>, required: true }
    },
    setup (props) {
        const store = useStore();
        const i18n = useI18n();
        const start = computed(() => moment(props.event.start).format('MMMM DD, YYYY HH:mm:ss'));
        const end = computed(() => moment(props.event.end).format(' MMMM DD, YYYY HH:mm:ss'));
        const likesGlobal = computed(() => store.getters['NEWS/getLikes']);
        const rooms = computed<Array<string>>(() => store.getters['NEWS/getRooms']);
        const userData = computed(() => store.getters['user/getIdentityProfile']);


        const likesRequested = ref(false);
        const formatedDescription = ref('false');

        let icsFile: string;

        const getReaction = async () => {

            try {
                const reactions = await store.dispatch('NEWS/getReactions', [props.event.id]);
                if (reactions.length) {
                    const index = likesGlobal.value.findIndex((reaction: Reaction) => reaction.idcontent === props.event.id);
                    if (index > -1) {
                        likesGlobal.value[index] = reactions[0];
                    } else {
                        likesGlobal.value.push(reactions[0]);
                    }
                } else {

                    const index = likesGlobal.value.findIndex((reaction: Reaction) => reaction.idcontent === props.event.id);
                    if (index === -1) {
                        likesGlobal.value.push({ idcontent: props.event.id, likes: 0, reacted: false, });
                    }
                }
                likesRequested.value = true;

            } catch (error) {

            }


        };

        const joinRoom = () => {
            const existRoom = rooms.value.some(room => room === props.event.id);

            if (!existRoom) {
                socketClient.emit('joinRoom', props.event.id); //join room event requires entry's id
                rooms.value.push(props.event.id as string);
                store.commit(`NEWS/${NewsMutations.SET_ROOMS}`, rooms.value);
            }
        };

        const getDescriptionText  = (text: string = props.event.extendedProps?.description) =>{
            let textToHTML = text.replace(/\[(.*?)\]\((.*?)\)/gi, '<a href="$2">$1</a>'); //fix the hyperlink
            textToHTML =  textToHTML.replace(/\n/g, '<br />'); //fix the break lines with br html
            return textToHTML; //return new text
        };


        const getDescription = () => {
            let text = '';
            // const textDescription = getDescriptionText();
            const lines = Math.ceil(props.event.extendedProps?.description.length / 74);
            let start = 0;
            let end = 62;
            for (let index = 0; index <= lines; index++) {
                if (index === 0) {
                    text += props.event.extendedProps?.description.substring(start, end);
                    start = 62;
                    end = start + 74;
                } else {
                    text += '<br >' + props.event.extendedProps?.description.substring(start, end);
                    start = end + 1;
                    end = start + 74;
                }
            }
            text = getDescriptionText(text);
            return text;
        };

        const getOffset = () => {
            return moment.parseZone(props.event.start).format('Z')
                .replace(':', '');
        };

        const getTimezone = () => {
            return userData.value.ccms[0].location.timezone;
        };
        const getDate = (value: string) => {

            let selectedDate;
            if (value === 'start') {
                selectedDate = props.event.start;

            } else {
                selectedDate = props.event.end;
            }
            selectedDate = moment(selectedDate, CONSTANTS.datetimeFormat).format('YYYYMMDD' + 'T' + 'HHmmss');

            return selectedDate;
        };
        const makeIcsFile = () => {
            const event =
                'BEGIN:VCALENDAR\n' +
                'CALSCALE:GREGORIAN\n' +
                'METHOD:PUBLISH\n' +
                'PRODID:-//My Interest//EN\n' +
                'VERSION:2.0\n' +
                'UID:My-Interest\n' +
                'BEGIN:VTIMEZONE\n' +
                `TZID:${getTimezone()}\n` +
                'BEGIN:STANDARD\n' +
                'DTSTART:16010101T000000\n' +
                `TZOFFSETFROM:${getOffset()}\n` +
                `TZOFFSETTO:${getOffset()}\n` +
                'END:STANDARD\n' +
                'END:VTIMEZONE\n' +
                'BEGIN:VEVENT\n' +
                `DTSTART;TZID="${getTimezone()}":${getDate('start')}\n` +
                `DTSTAMP:${moment().format('YYYYMMDD' + 'T' + 'HHmmss')}Z\n` +
                `DTEND;TZID="${getTimezone()}":${getDate('end')}\n` +
                'SUMMARY:' +
                props.event.title +
                '\n' +
                'UID:' + props.event.id + '\n' +
                `DESCRIPTION:${getDescriptionText()}\n` +
                `X-ALT-DESC;FMTTYPE=text/html:${getDescriptionText()}\n` +
                'END:VEVENT\n' +
                'END:VCALENDAR';
            const data = new File([event], 'MYTP Event.ics', { type: 'text/calendar;charset=utf-8', endings: 'native' });

            if (icsFile !== null) {
                window.URL.revokeObjectURL(icsFile);
            }

            icsFile = window.URL.createObjectURL(data);

            return icsFile;
        };

        const downloadEvent = () => {

            const file = makeIcsFile();
            const dwldLink = document.createElement('a');
            dwldLink.setAttribute('href', file);
            dwldLink.setAttribute('download', props.event.title + '.ics');
            dwldLink.style.visibility = 'hidden';
            document.body.appendChild(dwldLink);
            dwldLink.click();
            document.body.removeChild(dwldLink);
        };

        getReaction();
        joinRoom();
        const descriptionWithWrap = getDescriptionText();
        return { close, end, start, likesRequested, downloadEvent, formatedDescription, descriptionWithWrap, i18n};
    }
});
</script>

<style scoped>
.title {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 3rem;
}
</style>