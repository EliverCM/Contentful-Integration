<template>
    <div>
        <div class="columns is-tp-root">
            <div class="column py-0">
                <div class="container my-0">
                    <!-- page heading -->
                    <div
                        class="
                            columns
                            is-gapless
                            is-page-heading
                            is-multiline
                            is-flex-direction-row-reverse
                        "
                    >
                        <div class="column is-12 is-hidden-mobile">
                            <p class="is-title-date">{{ today }}</p>
                        </div>
                        <div
                            class="
                                column
                                is-narrow
                                is-flex-mobile
                                is-justify-content-flex-end
                            "
                        >
                            <router-link
                                class="
                                    button
                                    is-pink is-light is-wide
                                    has-text-left
                                "
                                :to="{ name: 'Home' }"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 0 24 24"
                                    width="24px"
                                    fill="#ffffff"
                                >
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path
                                        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                                    />
                                </svg>
                            </router-link>
                        </div>
                        <div class="column">
                            <p class="is-title-top">{{$t('MYINTEREST.admin.views.NewsAdmin.title')}}</p>
                        </div>
                        <div class="column is-12">
                            <p
                                class="
                                    is-title-main
                                    has-text-white has-background-black
                                    px-5
                                    py-3
                                "
                            >{{$t('MYINTEREST.admin.views.NewsAdmin.administration')}}</p>
                        </div>
                    </div>

                    <p class="admin-desc is-size-5 mb-2 has-text-weight-bold">
                        {{$t('MYINTEREST.admin.views.NewsAdmin.admindescmanage')}}
                    </p>
                    <p class="admin-desc mb-2">
                        {{$t('MYINTEREST.admin.views.NewsAdmin.admindescglobal')}}
                    </p>
                    <p class="admin-desc">
                        {{$t('MYINTEREST.admin.views.NewsAdmin.usersnotlisted')}}
                    </p>

                    <div class="buttons is-right mt-4 mb-0">
                        <button
                            class="button is-black"
                            @click="addContentCreator"
                        >{{$t('MYINTEREST.admin.views.NewsAdmin.addcontentcreator')}}</button>
                    </div>
                    <div class="table-container">
                        <table
                            class="
                                table
                                is-hoverable is-fullwidth is-transparent
                            "
                        >
                            <thead class="is-t-to-g">
                                <tr>
                                    <th colspan="2">{{$t('MYINTEREST.admin.views.NewsAdmin.contentcreator')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="user in usersAdmin"
                                    :key="user.oid"
                                    :value="user"
                                >
                                    <td class="is-vcentered">
                                        {{ user.name }}
                                    </td>
                                    <td class="is-vcentered">
                                        <div class="buttons is-right">
                                            <button
                                                class="button is-black"
                                                @click="
                                                    editContentCreator(user)
                                                "
                                            >{{$t('MYINTEREST.admin.views.NewsAdmin.view')}}</button>
                                            <button
                                                class="button is-danger"
                                                @click="
                                                    deleteContentCreator(user)
                                                "
                                            >{{$t('MYINTEREST.admin.views.NewsAdmin.remove')}}</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <transition name="modal" :duration="300">
            <ContentCreatorAdmin
                v-if="modalAdd"
                @close="closeAdd"
                :userName="selectedUserName"
                :userOID="selectedUserOID"
                :userUPN="selectedUserUPN"
                :userPosition="selectedUserPosition"
            />
        </transition>
        <transition name="modal" :duration="300">
            <NewsContentCreatorDelete
                v-if="modalDelete"
                @close="modalDelete = false"
                :userName="selectedUserName"
                :userOID="selectedUserOID"
            />
        </transition>
    </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { ref } from 'vue';
import NewsContentCreatorDelete from '../components/NewsContentCreatorDelete.vue';
import ContentCreatorAdmin from '../components/ContentCreatorAdmin.vue';
import moment from 'moment';
import { useI18n } from 'vue-i18n';

export default {
    name: 'NewsAdmin',
    components: {
        NewsContentCreatorDelete,
        ContentCreatorAdmin
    },
    setup () {

        // -------------------VARIABLES--------------------------
        const store = useStore();
        const i18n = useI18n();
        const usersAdmin = ref<Array<any>>();
        const selectedUserName = ref('');
        const selectedUserOID = ref('');
        const selectedUserUPN = ref('');
        const selectedUserPosition = ref('');
        const modalAdd = ref(false);
        const modalDelete = ref(false);
        const today = ref(moment().format('dddd, MMMM DD YYYY'));


        // -----------------FUNCTIONS------------------------
        const getUsersAdmin = async () => {
            const res = await store.dispatch('DELEGATEUSERS/getAllUsers');
            usersAdmin.value = res.users;
        };

        const addContentCreator = () => {
            selectedUserOID.value = '';
            selectedUserName.value = '';
            selectedUserUPN.value = '';
            selectedUserPosition.value = '';
            modalAdd.value = true;
        };

        const closeAdd = async () => {
            modalAdd.value = false;
            getUsersAdmin();
        };

        const editContentCreator = (user: { oid: string; name: string; upn: string; 'position_code_title': string }) => {
            selectedUserOID.value = user.oid;
            selectedUserUPN.value = user.upn;
            selectedUserPosition.value = user.position_code_title;
            selectedUserName.value = user.name;
            modalAdd.value = true;
        };

        const deleteContentCreator = (user: { oid: string; name: string }) => {
            selectedUserOID.value = user.oid;
            selectedUserName.value = user.name;
            modalDelete.value = true;
        };

        // --------------Initialized functions----------
        getUsersAdmin();

        // ---------------RETURNS---------------------
        return {
            selectedUserName, selectedUserOID, modalAdd, modalDelete, selectedUserUPN, selectedUserPosition,
            addContentCreator, editContentCreator, deleteContentCreator, usersAdmin, closeAdd, today, i18n
        };

    },
};
</script>

<style lang="scss" scoped>
</style>
