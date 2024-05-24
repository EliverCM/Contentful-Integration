<template>
    <FullCalendar ref="calendarRef" :options="calendarOptions" />

    <FullModal v-if="openModal" @close="closeModal">
        <EventDetails :event="selectedEvent" @close="closeModal" />
    </FullModal>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import '@fullcalendar/core/vdom'; // solves problem with Vite
import FullCalendar, { Calendar, CalendarOptions, DatesSetArg, EventClickArg } from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment';
import { useStore } from 'vuex';
import usePipeMoment from '@/composables/pipeMoment';
import EventDetails from './EventDetails.vue';
import FullModal from '@/components/FullModal.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    components: { FullCalendar, EventDetails, FullModal },
    setup () {
        const store = useStore();
        const i18n = useI18n();
        const { transformDates } = usePipeMoment();
        const selectedEvent = ref();
        const openModal = ref(false);
        const calendarRef = ref();
        const sidebarstatus = computed(() => store.state.user.sidebarstatus);
        const closeModal = () => {
            openModal.value = false;
            window.history.replaceState(history.state, '', history.state.current);
        };
        const calendarOptions = computed((): CalendarOptions => {
            return {
                plugins: [
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin
                ],
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: ''
                },
                initialView: 'dayGridMonth',
                editable: false,
                selectable: true,
                selectMirror: true,
                dayMaxEvents: true,
                weekends: true,
                hiddenDays: [],
                events: store.state.EVENTS.events,
                showNonCurrentDates: false,
                datesSet: async (info: DatesSetArg) => {
                    const request = {
                        start: moment(info.start).subtract(1, 'day')
                            .format()
                            .substring(0, 19) + '.000Z',
                        end: moment(info.end).add(1, 'day')
                            .format()
                            .substring(0, 19) + '.000Z',
                        pipeMoment: transformDates

                    };
                    await store.dispatch('EVENTS/getEvents', request);


                },
                eventClick: (event: EventClickArg) => {
                    selectedEvent.value = event.event;
                    openModal.value = true;
                    window.history.replaceState(history.state, '', `${history.state.current}/${event.event.id}`);
                },
                
                
            };
            
        });
        
        const rendercalendar = async () => {
            
            const calendar = calendarRef.value.calendar as Calendar;
            
            setTimeout(() => {
                calendar.updateSize();
            }, 400);
        };

        watch(sidebarstatus, () => {
            rendercalendar();
        });
        return { calendarRef, calendarOptions, openModal, rendercalendar, selectedEvent, closeModal, i18n };
    }

});


</script>

<style scoped lang="scss">
</style>