<template>
    <div class="container">
        <div
            v-if="showNavMenu"
            class="
                columns
                is-gapless
                is-page-heading
                is-multiline
                is-flex-direction-row-reverse
            "
        >
            <div class="column is-12 is-hidden-mobile">
                <p class="is-title-date">{{ today }}</p>
            </div>
            <div class="column">
                <p class="is-title-top">My Interests</p>
            </div>
            <div class="column is-12">
                <div class="menu">
                    <div
                        class="is-title-main menu-title"
                        v-for="menu in menuList"
                        :key="menu"
                    >
                        <router-link
                            :to="{ name: menu.route }"
                            :class="{
                                'is-gradient-text': menu.route === currentRoute,
                            }"
                        >
                            {{ menu.title }}
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { RouteRecordName, useRoute } from 'vue-router';
import { NewsMutations } from '@/modules/news/store/mutations';
import moment from 'moment';

export default defineComponent({
    name: 'NavMenu',
    setup () {
        const store = useStore();
        const route = useRoute();
        const today = ref(moment().format('dddd, MMMM DD YYYY'));
        const menuList = [
            {
                title: 'News', route: 'Home', filters: [
                    {
                        type: 'CATEGORY OPTIONS',
                        list: [
                            { name: 'Attendance' },
                            { name: 'Benefits' },
                            { name: 'Compliance' },
                            { name: 'Data Privacy - Specific Consent' },
                            { name: 'Facilities' },
                            { name: 'General' },
                            { name: 'Human Resources' },
                            { name: 'Operations' },
                            { name: 'Payroll' },
                            { name: 'Privacy' },
                            { name: 'Quality & Service' },
                            { name: 'Scheduling' },
                            { name: 'Security' },
                            { name: 'Service Alert' },
                            { name: 'Technology' },
                            { name: 'Training' },
                        ]
                    },
                    {
                        type: 'GEO SOURCE',
                        list: [
                            { name: 'Global' },
                            { name: 'Local' },
                            { name: 'Regional' }
                        ]
                    }
                ]
            },
            { title: 'Benefits', route: 'Benefits' },
            { title: 'Coupons', route: 'Coupons' },
            { title: 'Events', route: 'Events' }
        ];

        // --- FUNCTIONS
        const currentRoute = computed(() => route.name?.toString());
        const showNavMenu = computed(() => menuList.some(({ route }) => route === currentRoute.value));
        const setFilters = (route: RouteRecordName | null | undefined) => {
            const filters = menuList.find(menu => menu.route === route)?.filters || [];
            store.commit(`NEWS/${NewsMutations.SET_FILTERS}`, filters, { root: true });
        };

        setFilters(currentRoute.value);

        // --- Return
        return {
            currentRoute,
            today,
            menuList,
            showNavMenu
        };
    }
});
</script>

<style scoped lang="scss">
.menu {
    display: flex;
    gap: 25px;
}

.menu-title {
    a {
        color: darkgray;

        &:hover {
            color: var(--primary);
        }
    }
}
</style>