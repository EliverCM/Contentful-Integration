<template>
    <Calendar />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Calendar from '../components/FullCalendar.vue';

export default defineComponent({
    name: 'Home',
    components: { Calendar },
    setup () {
        return {};
    }
});
</script>

<style scoped>
</style>