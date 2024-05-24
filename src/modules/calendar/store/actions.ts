import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import { EventsState, EventsRequest, ContentfulEvent } from './types';
import apiContentful from '@/api/apiContentful';
import { EventsMutations } from './mutations';
import { EventInput } from '@fullcalendar/core';
import { CONSTANTS } from '@/constants/constants';

const requestsQueue: EventsRequest[] = [];
let pipeMoment: Function;

export const actions: ActionTree<EventsState, RootState> = {

    async getEvents ({ dispatch }, payload: EventsRequest) {
        pipeMoment = payload.pipeMoment;
        if (!await dispatch('handleRequestsQueue', payload)) {
            const events = await apiContentful.getEvents(payload);
            await dispatch('buildEvents', events);
        }
    },

    async handleRequestsQueue (_, request: EventsRequest) {
        const search = requestsQueue.some(
            req => JSON.stringify(req) === JSON.stringify(request)
        );
        if (!search) {
            requestsQueue.push(request);
            return false;
        } else {
            return true;
        }
    },

    async buildEvents ({ state, commit }, events: ContentfulEvent[]) {
        const allEvents = state.events;
        events.forEach((event: ContentfulEvent) => {
            const find = allEvents.some((x: EventInput) => x.id === event.sys.id);
            if (!find) {
                const calendarEvent: EventInput = {
                    title: event.fields.title,
                    description: event.fields.description,
                    start: pipeMoment(event.fields.startDateTime, CONSTANTS.dateFormatFull),
                    end: pipeMoment(event.fields.endDateTime, CONSTANTS.dateFormatFull),
                    id: event.sys.id,
                    image: event.fields.image.fields.file.url
                };
                allEvents.push(calendarEvent);
            }

        });
        commit(`EVENTS/${EventsMutations.SET_EVENTS}`, allEvents, { root: true });
    }
};
