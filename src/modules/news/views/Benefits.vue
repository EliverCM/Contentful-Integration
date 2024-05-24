<template>
    <NewsList newsType="Benefits" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NewsList from '../components/NewsList.vue';

export default defineComponent({
    name: 'Benefits',
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
