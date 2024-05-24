<template>
    <div class="columns is-vcentered is-fullheight">
        <div class="column has-text-centered">
            <img src="@/assets/unauthorized.svg">
            <div class="title is-2 mt-6">
                {{$t('MYINTEREST.Unauthorized.applicationNotAvailable')}}
            </div>
            <div class="subtitle is-3">{{$t('MYINTEREST.Unauthorized.contactSupport')}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'Unauthorized',
    setup () {
        const i18n = useI18n();
        return { i18n };
    }
});
</script>

<style scoped lang="scss">
</style>