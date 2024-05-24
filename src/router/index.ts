import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import store from '@/store';
import { AppMutations } from '@/store';
import { Menu } from '@/modules/user/store/types';

const routes: Array<RouteRecordRaw> = [
    {
        path: '',
        name: 'my-interest',
        component: () => import('@/layout/MainLayout.vue'),
        children: [
            {
                path: '',
                redirect: { path: '/news' }
            },
            {
                path: '/news',
                name: 'Home',
                component: () => import('@/modules/news/views/Home.vue'),
            },
            {
                path: '/benefits',
                name: 'Benefits',
                component: () => import('@/modules/news/views/Benefits.vue'),
            },
            {
                path: '/coupons',
                name: 'Coupons',
                component: () => import('@/modules/news/views/Coupons.vue'),
            },
            {
                path: '/newsadmin',
                name: 'NewsAdmin',
                component: () => import('@/modules/admin/views/NewsAdmin.vue'),
            },
            {
                path: '/news/:id',
                name: 'NewsDetail',
                component: () => import(/* webpackChunkName: "newsDetail" */ '@/modules/news/views/NewsDetail.vue'),
                props: { external: true },
            },
            {
                path: '/benefits/:id',
                name: 'benefitsDetail',
                component: () => import('@/modules/news/views/NewsDetail.vue'),
                props: { external: true },
            },
            {
                path: '/coupons/:id',
                name: 'couponsDetail',
                component: () => import('@/modules/news/views/NewsDetail.vue'),
                props: { external: true },
            },
            {
                path: '/Events',
                name: 'Events',
                component: () => import('@/modules/calendar/views/Home.vue'),
            },
            {
                path: '/unauthorized',
                name: 'Unauthorized',
                component: () => import('@/views/Unauthorized.vue')
            },
            // {
            //     path: '/MyInterests',
            //     name: 'MyInterests',
            //     component: () => import('@/views/TemporalView.vue'),
            // },
            // {
            //     path: '/Communications',
            //     name: 'Communications',
            //     component: () => import('@/views/TemporalView.vue'),
            // },
            
            // {
            //     path: '/account',
            //     name: 'Account',
            //     component: () => import('@/views/TemporalView.vue'),
            // },
        ],
    },

    { path: '/:pathMatch(.*)*', redirect: { path: '/news' } },
];
// if (process.env.VUE_APP_SHOW_CALENDAR === 'false') {
//     routes[0].children = routes[0].children?.filter((route) => route.name !== 'Events');
// };
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior () {
        // always scroll to top
        return { top: 0 };
    },
});

router.beforeEach(async (to, from, next) => {
    store.commit(AppMutations.SET_ALLOWED, false, { root: true }); // OJO DEJAR "SET_ALLOWED" EN FALSE (el root en true)
    document.title = 'My-Interest';
    const accessTokens = await store.dispatch('user/getAccessTokens', null, { root: true });
    if (!Object.keys(accessTokens).length) {
        window.location.href = process.env.VUE_APP_LOGIN_URL;
    } else {
        store.commit(AppMutations.SET_ALLOWED, true);
        if (to.name === 'NewsAdmin') {
            const hasMenuAdmin = store.getters['user/getMenu'].some((menuItem: Menu) => menuItem.description.toLowerCase() === 'admin');
            if (!hasMenuAdmin) router.push({ path: '/news' });;
            next();
        } else if (to.name === 'Events') {
            if (process.env.VUE_APP_SHOW_CALENDAR === 'false') {
                router.push({ path: '/news' });
            }
            next();
        } else {
            next();
        }
    }
});

export default router;
