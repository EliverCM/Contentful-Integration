<template>
    <NewsList newsType="Coupons" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NewsList from '../components/NewsList.vue';

export default defineComponent({
    name: 'Coupons',
    components: {
        NewsList,
    },
    setup () {
        return {};
    }
});
</script>

<style lang="scss" scoped>
</style>
