import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import Checkbox from '@/components/Checkbox.vue';
import Wait from '@/components/Wait.vue';
import i18n from '@/config/i18n';


library.add(fas);

createApp(App)
    .use(store)
    .use(router)
    .use(i18n)
    .component('fa', FontAwesomeIcon)
    .component('Checkbox', Checkbox)
    .component('Wait', Wait)
    .mount('#app');
