<template>
    <NewsList newsType="News" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NewsList from '../components/NewsList.vue';

export default defineComponent({
    name: 'Home',
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
