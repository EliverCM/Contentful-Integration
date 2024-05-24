<template>
    <div>
        <!-- notifications -->
        <div
            class="nav-item notifications"
            :class="{
                selected: selected == 'notifications',
                'has-notifications': notifications.length,
                'is-loading': loading
                //'is-loading':!loading && !notifications.length
            }"
            @click="select('notifications')"
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
                    d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
                />
            </svg>
            <div class="menu is-right" id="infinite-list" v-if="notifications">
                <ul>
                    <li v-if="notifications.length < 1">
                        <p class="title m-0 py-4">
                            {{$t('MYINTEREST.notifications.views.notifications.noNotifications')}}
                        </p>
                    </li>
                    <li
                        v-for="(notification, index) in notifications"
                        :key="index"
                        @click="actionType(notification)"
                    >
                        <div class="is-flex">
                            <p class="title is-flex-grow-1">
                                {{ notification.title }}
                            </p>
                            <button
                                class="delete"
                                @click.stop="
                                    markAsRead(
                                        notification.idEmployeeNotifications,
                                        index
                                    )
                                "
                            ></button>
                        </div>

                        <p class="description">{{ notification.body }}</p>
                        <div class="is-flex is-justify-content-space-between">
                            <p class="sender">{{ notification.nameEmp }}</p>
                            <p class="datetime">
                                {{ notification.dateCreated }}
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import usePipeMoment from '@/composables/pipeMoment';
import { Notification } from '../store/types';
import { defineComponent, onBeforeMount, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'Notifications',
    setup () {
        const tpNotifications = ref([]);
        const store = useStore();
        const i18n = useI18n();
        const { transformDates } = usePipeMoment();
        let counterPagination = 1;
        const notifications = ref<Notification[]>([]);
        const notificationPagination = ref<any>([]);
        // const statesNotification = ['Invalid state', 'Active', 'Expired', 'Deleted'];
        const loading = ref(false);
        const allDataLoaded = ref(false);

        const selected = ref('closed');
        const thisClickShouldCloseTheMenu = ref(true);

        const linkAction = 'https://mytp.teleperformance.com';

        // --- Functions
        const closeMenuItem = () => {
            if (thisClickShouldCloseTheMenu.value) {
                // console.log('that click should close', selected);
                selected.value = 'closed';
                document.removeEventListener('click', closeMenuItem);
            } else {
                // if this click did not trigger the closing of the menu, we
                // reset this variable to true since by default a click should
                // close the open menu
                thisClickShouldCloseTheMenu.value = true;
            }
        };

        const goToCalendar = (notification: Notification) => {
            if (notification.extraInfo) {
                const goTo = btoa(
                    'goTo=' + JSON.parse(notification.extraInfo).goTo
                );
                window.open(
                    linkAction + '/pages/ScheduleManagement/Schedule;' + goTo,
                    '_blank'
                );
            } else {
                window.open(linkAction + '/pages/ScheduleManagement/Schedule');
            }
        };

        const actionType = async (notification: Notification) => {
            console.log(notification);
            switch (notification.typeNotification) {
                case 1:
                    //openBirthday
                    break;
                case 2:
                    window.open(
                        linkAction + '/pages/ScheduleManagement/Swap',
                        '_blank'
                    );
                    break;
                case 3:
                    window.open(notification.urlNoti, '_blank');
                    break;
                case 9:
                    goToCalendar(notification);
                    break;
                case 12:
                    window.open(
                        linkAction + '/pages/Others/Job_Offer',
                        '_blank'
                    );
                    break;
                case 13:
                    // let openSentiments = inject('runSentiments');
                    // openSentiments = true;
                    await store.dispatch('SENTIMENTS/openEmotions', true);
                    break;
                default:
                    break;
            }
        };

        const getNotifications = async (counter: number) => {
            try {
                loading.value = true;
                const responseAPI = await store.dispatch(
                    'NOTIFICATIONS/actGetNotificationList',
                    counter
                );
                const activesNotifications = responseAPI.result.filter(
                    (notification: Notification) => notification.active === 1
                );
                const mappedActiveNotifications = activesNotifications.map(
                    (notification: Notification) => {
                        notification.dateCreated = transformDates(notification.dateCreated);
                        return notification;
                    }
                );
                notifications.value.push(...mappedActiveNotifications);
                // notifications.value.push(...(await store.dispatch('NOTIFICATIONS/actGetNotificationList', counter)).result);
                loading.value = false;
                //console.log('notifications content: ', notifications.value);
            } catch (error) {
                console.error(error);
            }
            allDataLoaded.value  = true;
        };

        const infiniteLoad = async () => {
            counterPagination += 1;
            if (
                counterPagination <= notificationPagination.value[0].TotalPages
            ) {
                await getNotifications(counterPagination);
            }
        };
        const select = async (item: string) => {
            // there are 3 use cases that could be true at the time this is called
            // 1. nothing else was open when you clicked on this nav-item
            // 2. this nav-item already had its menu open when you clicked on this nav-item
            // 3. a selected subitem of nav item don't close de menu
            // 4. a different nav-item had its menu open when you clicked this nav-item

            // use case 1
            if (selected.value == 'closed') {
                // since there were no menus open when this was clicked, we open the menu
                // and create this event listener to close the menu when appropriate

                // it is inside of a setTimeout so that the click that triggered this method does
                // not trigger the closeMenuItem() to fire as well
                setTimeout(
                    () => document.addEventListener('click', closeMenuItem),
                    0
                );
            } else if (selected.value == item) {
                // use case 2
                // if the user clicked on a nav-item whose menu is already open, then we can let
                // the event handler trigger closeMenuItem() to close the menu
                thisClickShouldCloseTheMenu.value = true;
            } else if (selected.value == 'notification') {
                // use case 3
                // if the user clicked on a subitem of nav-item whose menu is already open, then we cannot let
                // Should NOT close the open menu
                thisClickShouldCloseTheMenu.value = false;
            } else {
                // use case 3
                // with this variable, we let the closeMenuItem method know that this click
                // should NOT close the open menu
                thisClickShouldCloseTheMenu.value = false;
            }

            // this will cause the appropriate menu to open
            selected.value = item;

            // actionType(notification);
        };

        onMounted(() => {
            const listElm = document.querySelector(
                '#infinite-list'
            ) as HTMLElement;
            listElm.addEventListener('scroll', async () => {
                if (
                    listElm.scrollHeight - listElm.scrollTop <= 800 &&
                    !loading.value
                ) {
                    await infiniteLoad();
                }
            });
        });

        onBeforeMount(async () => {
            loading.value = true;
            try {
                const responseAPI = await store.dispatch(
                    'NOTIFICATIONS/actGetNotificationList',
                    counterPagination
                );
                const activesNotifications = responseAPI.result.filter(
                    (notification: Notification) => notification.active === 1
                );
                const mappedActiveNotifications = activesNotifications.map(
                    (notification: Notification) => {
                        notification.dateCreated = transformDates(notification.dateCreated);
                        return notification;
                    }
                );
                notifications.value = mappedActiveNotifications;
                notificationPagination.value = responseAPI.pagination;
                allDataLoaded.value  = true;
            } catch (error) {
                console.log(error);
            }
            loading.value = false;
        });

        const postMarkAsRead = async (id: number) => {
            try {
                await store.dispatch('NOTIFICATIONS/actMarkAsRead', id);
            } catch (error) {
                console.log(error);
            }
        };

        function markAsRead (idNotification: number, idArray: number): void {
            notifications.value[idArray].active = 0;
            notifications.value = notifications.value.filter(
                (notification: Notification) => notification.active === 1
            );
            postMarkAsRead(idNotification);
        }

        return {
            selected,
            thisClickShouldCloseTheMenu,
            select,
            closeMenuItem,
            tpNotifications,
            infiniteLoad,
            notifications,
            markAsRead,
            actionType,
            loading,
            i18n
        };
    }
});
</script>

<style></style>
