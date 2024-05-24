<template>
    <Blur />
    <Header />
    <NavMenu />
    <div class="columns is-tp-root">
        <div class="column py-0">
            <div class="container my-0">
                <div class="is-tall">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Blur from '@/components/Blur.vue';
import Header from './Header.vue';
import NavMenu from './NavMenu.vue';

export default defineComponent({
    name: 'MainLayout',
    components: {
        Blur,
        Header,
        NavMenu,
    },
    setup () {
        return {};
    }
});
</script>

<style lang="scss" scoped>
</style>