<template>
    <div class="columns is-gapless is-tp-navigation">
        <!-- left hand side of menu -->
        <div class="column is-flex">
            <!-- grid -->
            <div
                class="nav-item grid"
                :class="{ selected: selected == 'grid' }"
                @click="select('grid')"
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
                        d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"
                    />
                </svg>
                <div class="menu is-left" @click="doNotCloseMenu">
                    <div class="box is-borderless my-1 mx-3 px-3 pt-3 pb-0">
                        <ul>
                            <li
                                v-for="(app, i) in appsList"
                                :key="'app_' + i"
                                class="p-0 pb-2"
                            >
                                <a
                                    :href="app.url"
                                    class="box is-borderless is-grid-item"
                                >
                                    <div class="columns">
                                        <div
                                            class="
                                                column
                                                is-narrow
                                                is-flex
                                                is-align-items-flex-start
                                            "
                                        >
                                            <div
                                                class="logo"
                                                :class="{ mytplogo: i == 0 }"
                                            >
                                                <figure class="image is-24x24">
                                                    <img
                                                        :src="
                                                            require(`@/assets/${app.img}`)
                                                        "
                                                        alt=""
                                                    />
                                                </figure>
                                            </div>
                                        </div>
                                        <div class="column">
                                            <p
                                                class="
                                                    has-text-weight-800
                                                    is-size-6
                                                    mb-1
                                                "
                                            >
                                                {{ app.name }}
                                            </p>
                                            <p class="is-size-7 has-text-grey">
                                                {{ app.text }}
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- application logo (home button) -->
            <router-link class="nav-item logologo" :to="{ name: 'Home' }">
                <figure class="image is-mytp-logo">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="12"
                            fill="url(#paint0_linear_102_426)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_102_426"
                                x1="0"
                                y1="12"
                                x2="24"
                                y2="12"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#780096" />
                                <stop offset="1" stop-color="#FF0082" />
                            </linearGradient>
                        </defs>
                    </svg>
                </figure>
            </router-link>
        </div>

        <!-- right hand side of menu -->
        <div class="column is-narrow is-flex is-justify-content-flex-end">
            <!-- sentiment -->
            <div
                class="nav-item sentiment"
                :class="{ selected: selected == 'sentiment' }"
                @click="openSentiments()"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    enable-background="new 0 0 24 24"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    fill="#000000"
                >
                    <g><rect fill="none" height="24" width="24" /></g>
                    <g>
                        <g />
                        <g>
                            <circle cx="15.5" cy="9.5" r="1.5" />
                            <circle cx="8.5" cy="9.5" r="1.5" />
                            <path
                                d="M12,18c2.28,0,4.22-1.66,5-4H7C7.78,16.34,9.72,18,12,18z"
                            />
                            <path
                                d="M11.99,2C6.47,2,2,6.48,2,12c0,5.52,4.47,10,9.99,10C17.52,22,22,17.52,22,12C22,6.48,17.52,2,11.99,2z M12,20 c-4.42,0-8-3.58-8-8c0-4.42,3.58-8,8-8s8,3.58,8,8C20,16.42,16.42,20,12,20z"
                            />
                        </g>
                    </g>
                </svg>
            </div>

            <Notifications />

            

            <!-- user -->
            <div
                class="nav-item user"
                :class="{ selected: selected == 'user' }"
                @click="select('user')"
            >
            
                <figure class="image is-32x32">
                    <img :src="user.userImg" class="is-rounded" alt="" />
                </figure>
                <div class="menu is-right" @click="doNotCloseMenu">
                    <div class="box is-borderless my-1 mx-3">
                        <div class="is-flex is-justify-content-end control">
                            <div class="select is-small">
                                    <select @change="changeLanguageDrop($event.target.value)">
                                        <option v-for="lang in supportedLanguages" :key="lang.id" :value="lang.code">{{ lang.nativeName }}</option>
                                    </select>
                            </div>
                        </div>
                        <figure class="image is-64x64">
                            <img
                                :src="user.userImg"
                                class="is-border-radius-4"
                                alt=""
                            />
                        </figure>
                        <p class="is-size-3 has-text-weight-800 mt-2">
                            {{ user.identityProfile.ccms[0].employee.name }}
                        </p>
                        <p class="is-size-6 has-text-weight-400 has-text-grey">
                            {{ user.identityProfile.ccms[0].company.name }}
                        </p>
                        <div
                            class="
                                is-flex is-justify-content-space-between
                                mt-3
                            "
                        >
                            
                            <router-Link
                                v-if="hasMenuAdmin"
                                :to="{ name: 'NewsAdmin' }"
                                class="button is-danger is-light"
                            >
                                Admin
                            </router-Link>
                            

                            <a
                                href="https://login.ontp.app/logout"
                                class="button is-danger is-light"
                            >
                                Log Out
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    </div>
    <Sentiments
        v-if="openSentimentsRef"
        @close="openSentimentsRef = false"
    ></Sentiments>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';
import Sentiments from '@/modules/sentiments/views/Sentiments.vue';
import Notifications from '@/modules/notifications/views/Notifications.vue';
import { socketClient } from '@/sockets/socketio';
import { NewsMutations } from '@/modules/news/store/mutations';
import { Reaction } from '@/modules/news/store/types';
import { Menu } from '@/modules/user/store/types';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'Header',
    components: {
        Sentiments,
        Notifications
    },
    setup () {
        const store = useStore();
        const selected = ref('closed');
        const thisClickShouldCloseTheMenu = ref(true);
        const openSentimentsRef = ref(false);

        const supportedLanguages = ref([]);
        const { locale, setLocaleMessage } = useI18n();
        const i18n = useI18n();
        const runModal = computed(
            () => store.getters['SENTIMENTS/getOpenModal']
        );
        const user = computed(() => store.state.user);
        const likesGlobal = computed<Array<Reaction>>(
            () => store.getters['NEWS/getLikes']
        );
        const hasMenuAdmin = computed(() =>
            store.state.user.menu.some(
                (menuItem: Menu) =>
                    menuItem.description.toLowerCase() === 'admin'
            )
        );
        const appsList = ref<Array<any>>([]);
        const apps = [
            {
                img: 'mytp.svg',
                name: 'myTP Platform',
                text:
                    'The central hub of the myTP experience. Access everything myTP has to offer from one place.',
                button: 'Home.home.MYTPLearningButton',
                url: 'https://mytp.ontp.app'
            },
            {
                img: 'ccms.svg',
                name: 'CCMS',
                text:
                    'A system for streamlined management of human resources. CCMS centralizes business and performance methods and employee data.',
                button: 'Home.home.CCMSButton',
                url: 'https://login.ontp.app/mytp/hr'
            },
            {
                img: 'mytpLearning.svg',
                name: 'MYTP Learning',
                text:
                    'A global platform used to increase your knowledge and skill. Get training and educational experiences that focus on you as the learner.',
                button: 'Home.home.MYTPLearningButton',
                url: 'https://login.ontp.app/mytp/learning'
            },
            {
                img: 'myInterests.svg',
                name: 'My Interests',
                text:
                    'A collection of information specific to your role here at Teleperformance. Get news, exclusive access, and custom content.',
                button: 'Home.home.MyInterestsButton',
                url: 'https://myinterests.ontp.app'
            }
        ];

        //apps Limited
        const appsLimited = {
            raf: {
                img: 'referAFriend.svg',
                name: 'Refer a Friend',
                text:
                    'An online system that makes it easier than ever to recommend job candidates to join the TP Family. Refer your family and friends today.',
                button: 'Home.home.RAFButton',
                url: 'https://raf.ontp.app'
            },
            ews: {
                img: 'ews.svg',
                name: 'Employee Warning Signals',
                text:
                    'A practical tool that supervisors use to measure and track the risk of attrition in their teams. Retain the best employees to achieve the best results.',
                button: 'Home.home.RAFButton',
                url: 'https://ews.ontp.app'
            }
        };

        //Functions

        const getParameters = async () => {
            Promise.all([
                store.dispatch('SENTIMENTS/getParameters', 2),
                store.dispatch('SENTIMENTS/syncEmotions')
            ]);
        };

        const getAccess = async () => {
            const apps2 = [...apps];
            try {
                const hasAccessRaf = await store.dispatch('user/getAccessRaf');
                if (hasAccessRaf) {
                    apps2.push(appsLimited.raf);
                }
            } catch (error) {
                console.error('Error: Access raf', error);
            }

            try {
                const hasAccessEws = await store.dispatch('user/getAccessEWS');
                if (hasAccessEws) {
                    apps2.push(appsLimited.ews);
                }
            } catch (error) {
                console.error('Error: Access EWS', error);
            }
            appsList.value = apps2;
            // return appsList;
        };
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

        watch(runModal, () => {
            if (runModal.value) {
                openSentimentsRef.value = true;
            }
        });

        const select = (item: string) => {
            // there are 3 use cases that could be true at the time this is called
            // 1. nothing else was open when you clicked on this nav-item
            // 2. this nav-item already had its menu open when you clicked on this nav-item
            // 3. a different nav-item had its menu open when you clicked this nav-item

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
            } else {
                // use case 3
                // with this variable, we let the closeMenuItem method know that this click
                // should NOT close the open menu
                thisClickShouldCloseTheMenu.value = false;
            }
            // this will cause the appropriate menu to open
            selected.value = item;
        };

        const doNotCloseMenu = () => {
            thisClickShouldCloseTheMenu.value = false;
        };

        const openSentiments = async () => {
            openSentimentsRef.value = true;
            // await store.dispatch('SENTIMENTS/openEmotions', true);
        };

        // socket reaction event: listen reaction
        socketClient.on('Reactions', async data => {
            const likes = data.likes;
            const findContent = likesGlobal.value.findIndex(
                component => component.idcontent === data.id
            );

            const allLikes = [...likesGlobal.value];
            allLikes[findContent].likes = likes; //update likes with data

            //set all likes updated after event received
            store.commit(`NEWS/${NewsMutations.SET_LIKES}`, allLikes, {
                root: true
            });
        });

        const changeLanguageDrop = async (temp: string) => {
            const res = await store.dispatch('user/getLenguagesOptions');
            supportedLanguages.value = res;
            console.log(temp);
            const change = await store.dispatch('user/getLenguageApp', temp);
            setLocaleMessage(temp, change);
            locale.value = temp;
        };

        changeLanguageDrop('en');

        //init
        getParameters();
        getAccess();

        return {
            selected,
            thisClickShouldCloseTheMenu,
            select,
            closeMenuItem,
            user,
            // apps,
            appsList,
            doNotCloseMenu,
            openSentiments,
            openSentimentsRef,
            hasMenuAdmin,
            supportedLanguages,
            i18n,
            changeLanguageDrop
        };
    }
});
</script>

<style lang="scss">
.fa-grin-alt {
    color: #01826c;
    // border: #a00095 solid 2px !important;
}
.fa-meh {
    color: #fadd6e;
}
.fa-frown {
    color: #ed8605;
}
.fa-sad-tear {
    color: #eb0028;
}
.fa-tired {
    color: #cc0001;
}
.iconHeader {
    width: 1.7rem !important;
    height: 1.7rem !important;
}
.mytplogo {
    margin-top: 5px;
}
</style>
