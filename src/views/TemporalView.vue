<template>
    <div class="columns is-vcentered is-fullheight">
        <div class="column has-text-centered">
            <img class="imgTemporal" src="@/assets/temporalDevelopment.svg">
            <div class="title is-2 mt-6">
                {{$t('MYINTEREST.TemporralView.componentNotAvailable')}}
            </div>
            <div class="subtitle is-3">{{$t('MYINTEREST.TemporralView.componentNotAvailableSubtitle')}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'TemporalView',
    setup () {
        const i18n = useI18n();
        return { i18n };
    }
});
</script>

<style scoped lang="scss">

.imgTemporal {
    width: 40%;
}

</style>