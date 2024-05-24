<template>
    <div class="modal is-active is-danger">
        <div class="modal-background" @click="close"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title"></p>
                <button class="delete" aria-label="close" @click="close"></button>
            </header>
            <section class="modal-card-body">
                <p class="title is-2">{{$t('MYINTEREST.admin.components.newsContentCreatorDelete.title')}}</p>
                <div class="notification is-danger">
                    <p>{{$t('MYINTEREST.admin.components.newsContentCreatorDelete.softwarebeta')}}</p>
                </div>
                <p class="title is-6 mt-5 mb-2">{{$t('MYINTEREST.admin.components.newsContentCreatorDelete.inconsistent')}}</p>
                <p>{{$t('MYINTEREST.admin.components.newsContentCreatorDelete.featuresCases')}}</p>
                <p class="title is-6 mt-5 mb-2">{{$t('MYINTEREST.admin.components.newsContentCreatorDelete.unhandlederrors')}}</p>
                <p>{{$t('MYINTEREST.admin.components.newsContentCreatorDelete.readingwriting')}}</p>
                <p class="title is-6 mt-5 mb-2">{{$t('MYINTEREST.admin.components.newsContentCreatorDelete.speedissues')}}</p>
                <p>{{$t('MYINTEREST.admin.components.newsContentCreatorDelete.duringinitial')}}</p>
                <p class="title is-6 mt-5 mb-2">{{$t('MYINTEREST.admin.components.newsContentCreatorDelete.enhancements')}}</p>
                <p>{{$t('MYINTEREST.admin.components.newsContentCreatorDelete.bestexperience')}}</p>
            </section>
            <footer class="modal-card-foot">
                <div class="columns">
                    <div class="column">
                        <button class="button is-light" @click="close">{{$t('MYINTEREST.admin.components.newsContentCreatorDelete.cancel')}}</button>
                    </div>
                    <div class="column is-narrow">
                        <button class="button is-danger" @click="removeUser">{{$t('MYINTEREST.admin.components.newsContentCreatorDelete.removeuser')}}</button>
                    </div>
                </div>
            </footer>
        </div>
    </div>
</template>

<script lang="ts">
import { useStore, mapState } from 'vuex';
import { computed, defineComponent, reactive, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'NewsContentCreatorDelete',
    props: {
        userName: { type: String, default: ''},
        userOID: { type: String, default: ''},
    },
    emits: ['close'],
    setup (props, { emit }) {

        const selectedUser = ref('');
        const store = useStore();
        const i18n = useI18n();

        const close = () => {
            emit('close');
        };

        const userExists = () => {
            if (props.userName)     {
                selectedUser.value = props.userOID;
            }
        };

        const removeUser = async () => {
            try {
                const params = {
                    oid: selectedUser.value,
                };
                await store.dispatch('DELEGATEUSERS/deleteUserAdmin', params);
                // showSuccess.value = true;
                // showDanger.value = false;
                selectedUser.value = '';
                console.log('borrado');
            } catch (error) {
                // showSuccess.value = false;
                // showDanger.value = true;
                console.log('error');
            }
        };




        userExists();


        
        return {
            close, removeUser, selectedUser, i18n
        };

    },
});
</script>

<style lang="scss" scoped>
.modal.is-danger {
    border: 3px solid red;

    .modal-background {
        background-color: rgba(56,0,0,.86);
    }
}
</style>
