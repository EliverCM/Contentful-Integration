<template>
    <div class="modal is-active">
        <div class="modal-background" @click="close"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title title is-2">
                    {{$t('MYINTEREST.admin.components.contentCreatorAdmin.title')}}
                </p>
                <button
                    class="delete"
                    aria-label="close"
                    @click="close"
                ></button>
            </header>

            <section class="modal-card-body">
                <!-- <p class="title is-2 mb-2">Content Creator Detail</p> -->

                <transition :name="transitionName" mode="out-in">
                    <!-- step 1 -->
                    <div v-if="step === 1 && !userAlreadySelected" key="step1">
                        <p class="mb-6">
                            {{$t('MYINTEREST.admin.components.contentCreatorAdmin.selectUser')}}
                        </p>
                        <label class="label">{{$t('MYINTEREST.admin.components.contentCreatorAdmin.username')}}</label>
                        <div class="field has-addons">
                            <div class="control is-expanded">
                                <input
                                    class="input"
                                    type="text"
                                    v-on:keyup.enter="getUsers()"
                                    placeholder="{{$t('MYINTEREST.admin.components.contentCreatorAdmin.finduserplaceholder')}}"
                                    v-model="NewUser.userName"
                                />
                            </div>
                            <div class="control">
                                <a
                                    :class="{ 'is-loading': loadingUsers }"
                                    class="button is-black"
                                    @click="getUsers()"
                                >
                                {{$t('MYINTEREST.admin.components.contentCreatorAdmin.searchuser')}}
                                </a>
                            </div>
                        </div>
                        <label class="label mt-5">{{$t('MYINTEREST.admin.components.contentCreatorAdmin.searchresult')}}</label>
                        <ul v-if="didSearch" class="mb-6">
                            <li
                                v-for="user in users"
                                :key="user.oid"
                                class="is-selectable"
                                :class="{ selected: selectedUser == user.oid }"
                                @click="selectUser(user.oid)"
                            >
                                <p class="name has-text-weight-600">
                                    {{ user.name }}
                                </p>
                                <p v-if="user.upn" class="tpid">
                                    {{ user.upn }}
                                </p>
                                <p
                                    v-if="user.position_code_title"
                                    class="position-code-title"
                                >
                                    {{ user.position_code_title }}
                                </p>
                            </li>
                        </ul>
                        <div v-else class="notification">
                            <p>{{$t('MYINTEREST.admin.components.contentCreatorAdmin.results')}}</p>
                        </div>
                        <div
                            v-if="showlistDanger"
                            class="notification is-danger is-light"
                        >
                            <button
                                class="delete"
                                @click="closelistDanger"
                            ></button>
                            {{$t('MYINTEREST.admin.components.error.listingusers')}}<strong>{{$t('MYINTEREST.admin.components.error.tryagain')}}</strong>
                        </div>
                    </div>

                    <!-- step 2 -->
                    <div v-else-if="step === 2" key="step2">
                        <p class="mb-6">
                            {{$t('MYINTEREST.admin.components.contentCreatorAdmin.selectGlobal')}}
                            <strong>{{ selectedUserInfo.name }}</strong>
                            {{$t('MYINTEREST.admin.components.contentCreatorAdmin.chooseaudience')}}
                        </p>
                        <label class="label">{{$t('MYINTEREST.admin.components.contentCreatorAdmin.selecteduser')}}</label>
                        <ul class="is-search-results mt-2 mb-6">
                            <li class="is-selectable already-selected">
                                <p class="name has-text-weight-600">
                                    {{ selectedUserInfo.name }}
                                </p>
                                <p class="tpid">{{ selectedUserInfo.upn }}</p>
                                <p class="position-code-title">
                                    {{ selectedUserInfo.position_code_title }}
                                </p>
                            </li>
                        </ul>

                        <div v-show="showNotification" class="field mt-2">
                            <label class="label">Company</label>
                            <div class="control is-expanded">
                                <p>
                                    {{$t('MYINTEREST.admin.components.contentCreatorAdmin.userpermissions', { companies: companiesMade.length })}}
                                </p>
                                <br />
                                <wait
                                    v-if="loadingCompanies"
                                    style="min-height: 250px"
                                />

                                <div
                                    v-if="enableEditScopes"
                                    class="checklistscroll is-fullwidth"
                                >
                                    <div class="has-text-left dropdown-item">
                                        <div class="field">
                                            <div class="control">
                                                <Checkbox
                                                    @change="toggleSelectAll"
                                                    v-model="selectAll"
                                                >
                                                    {{
                                                        !selectAll
                                                            ? "Select all"
                                                            : "Unselect all"
                                                    }}
                                                </Checkbox>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        v-show="!loadingCompanies"
                                        class="has-text-left dropdown-item"
                                        v-for="company in companiesList"
                                        :key="company.id"
                                    >
                                        <div class="field">
                                            <div class="control">
                                                <label
                                                    :for="company.id"
                                                    class="is-clickable"
                                                    style="display: block"
                                                >
                                                    <Checkbox
                                                        :id="company.id"
                                                        v-model="companiesMade"
                                                        :value="company.id"
                                                        @change="
                                                            validateSelectAll(
                                                                company.id
                                                            )
                                                        "
                                                    >
                                                        {{ company.name }}
                                                    </Checkbox>
                                                    <!-- <input :id="company.id" type="checkbox" v-model="companiesMade"
                                                            :value="company.id" @change="
                                                                selectingCompany(
                                                                    company.id
                                                                )
                                                            " />
                                                        {{ company.name }} -->
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <span
                                    v-if="
                                        !companiesMade.length &&
                                        !loadingCompanies
                                    "
                                    for="required"
                                    class="has-text-danger"
                                    >{{$t('MYINTEREST.admin.components.contentCreatorAdmin.leatonecompany')}}</span
                                >
                                <div
                                    v-if="
                                        !loadingCompanies &&
                                        !enableEditScopes &&
                                        getNames.length
                                    "
                                >
                                    <ul class="is-search-results mt-2 mb-6">
                                        <li
                                            class="
                                                already-selected
                                                is-selectable
                                            "
                                        >
                                            <p
                                                v-for="company in getNames"
                                                :key="company"
                                                class="name"
                                            >
                                                {{ company }}
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- step 3 -->
                    <div v-else key="step3">
                        <div
                            v-if="!hasErrorSave && !hasErrorRemove"
                            class="notification is-success is-light"
                        >
                        {{$t('MYINTEREST.admin.components.contentCreatorAdmin.companiesupdated')}}
                        </div>

                        <div
                            v-if="hasErrorSave || hasErrorRemove"
                            class="notification is-danger is-light"
                        >{{$t('MYINTEREST.admin.components.error.ups')}}
                            <strong>{{$t('MYINTEREST.admin.components.error.tryagain')}}</strong>
                        </div>
                    </div>
                </transition>
            </section>

            <footer class="modal-card-foot">
                <div class="columns is-mobile">
                    <div class="column is-narrow">
                        <button
                            class="button is-black is-wide has-text-left"
                            @click="step = 1"
                            v-if="step == 2 && !userAlreadySelected"
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
                        </button>
                    </div>
                    <div class="column"></div>
                    <div class="column is-narrow">
                        <div class="is-flex justify-content-space-around">
                            <button
                                v-if="step === 2"
                                class="button is-black"
                                @click="enableEdit"
                            >
                                {{ !enableEditScopes ? "Edit" : "Summary" }}
                            </button>
                            <button
                                class="button is-black is-wide has-text-right"
                                :class="{ 'is-loading': savingData }"
                                @click="proceed"
                                :disabled="activeProceedButton"
                                v-if="step < 3"
                            >
                                <svg
                                    v-if="step == 1 && !userAlreadySelected"
                                    data-v-31394841=""
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    width="24"
                                >
                                    <path
                                        data-v-31394841=""
                                        d="M0 0h24v24H0z"
                                        fill="none"
                                    ></path>
                                    <path
                                        data-v-31394841=""
                                        fill="white"
                                        d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
                                    ></path>
                                </svg>
                                <svg
                                    v-else
                                    v-show="!savingData"
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 0 24 24"
                                    width="24px"
                                    fill="#ffffff"
                                >
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path
                                        d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { computed, defineComponent, reactive, ref, toRefs } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
export default defineComponent({
    name: 'ContentCreatorAdmin',
    props: {
        userName: { type: String, default: '' },
        userOID: { type: String, default: '' },
        userUPN: { type: String, default: '' },
        userPosition: { type: String, default: '' }
    },
    emits: ['close'],
    setup (props, { emit }) {

        // --- VARIABLES --------------------------
        const store = useStore();
        const userAlreadySelected = ref(false);
        const didSearch = ref(false);
        const selectedUser = ref('');
        const step = ref(1);
        const showSuccess = ref(false);
        const showDanger = ref(false);
        const showlistDanger = ref(false);
        const showNotification = ref(true);

        const users = ref<Array<any>>([]);
        const searchLoading = ref(false);

        const usersAdmin = ref<Array<any>>([]);
        const searchLoadingAdmin = ref(false);
        const allScopesList = ref<Array<any>>([]);
        const companiesList = ref<Array<any>>([]);
        const companiesMade = ref<Array<any>>([]);
        const selectAllCompanies = ref(false);

        const clientsList = ref<Array<any>>([]);
        const allClientList = ref<Array<any>>([]);
        const selectAllClients = ref(false);

        const locationsList = ref<Array<any>>([]);
        const selectAllLocations = ref(false);

        const otherProgramsList = ref<Array<any>>([]);

        const programsList = ref<Array<any>>([]);
        const allProgramList = ref<Array<any>>([]);
        const selectAllPrograms = ref(false);
        const userSelected = ref(false);
        
        const i18n = useI18n();

        //enable edit scopes
        const enableEditScopes = ref(false);
        const selectAll = ref(false);

        const paginatePrograms = ref(50); let totalPages = 0;
        let currentPage = 0;

        const form = reactive<any>({
            company: null,
            clients: [],
            locations: [],
            programs: [],
        });
        const NewUser = ref<any>({
            userName: '',
            oid: '',
            profiles: [{}],
            save: true,
        });
        const user = ref<any>({
            userName: '',
            oid: '',
            profiles: [{}],
            save: true,
        });
        const loadings = reactive<any>({
            loadingClients: false,
            loadingCompanies: false,
            loadingLocations: false,
            loadingPrograms: false,
            loadingUsers: false,
            savingData: false,
        });

        const companiesToRemove = ref<Array<number>>([]);
        const companiesToSave = ref<Array<number>>([]);
        const userCompanies = ref<Array<any>>([]);

        const hasErrorSave = ref(false);
        const hasErrorRemove = ref(false);

        const rules = {
            company: { required },
            clients: { required },
            locations: { required },
            programs: { required },
        };

        const v$ = useVuelidate(rules, form);


        // --- COMPUTED ---------------------------
        const transitionName = computed(() => {
            let name = 'slide-fade-right';

            if (step.value == 2) {
                name = 'slide-fade-left';
            }

            // override the transition so we go directly to step 2 when editing
            if (user.value) {
                name = 'none';
            }

            return name;
        });

        const selectedUserInfo = computed(() => {
            let user = { name: '', oid: '', upn: '', 'position_code_title': '' };

            if (selectedUser.value) {
                if (userAlreadySelected.value) {
                    user = { name: props.userName, oid: props.userOID, upn: props.userUPN, 'position_code_title': props.userPosition };
                } else {
                    user = users.value.find(u => u.oid == selectedUser.value);
                }

            }

            return user;
        });

        //get companies names -computed
        const getNames = computed(() => {
            return companiesMade.value.map((cp) => companiesList.value.find((x) => x.id === cp).name);
        });

        //functions to active proceed button
        const companiesToDelete = () => {
            const deleteIds = userCompanies.value.filter((cp: any) => !companiesMade.value.some((x) => x === cp.id))
                .map((x: any) => x.id);
            return deleteIds;
        };
        const companiesAdd = () => {
            const addIds = companiesMade.value.filter((cp) => !userCompanies.value.some((x: any) => x.id === cp));
            return addIds;
        };

        //boolean active proceed button - computed
        const activeProceedButton = computed(() => {
            let disabled = true;

            if (step.value === 1 && selectedUser.value) {
                disabled = false;
            } else {
                if (companiesMade.value.length) disabled = false;
                if (selectedUserInfo.value && (companiesToDelete().length || companiesAdd().length)) {
                    disabled = false;
                } else {
                    disabled = true;
                };
                if (!companiesMade.value.length) disabled = true;
            }

            if (loadings.savingData) {
                disabled = true;
            }
            return disabled;
        });


        // --- FUNCTIONS -------------------------- 
        const close = () => {
            emit('close');
        };
        const closeSuccess = () => {
            showSuccess.value = false;
            showNotification.value = true;
        };
        const closeDanger = () => {
            showDanger.value = false;
            showNotification.value = true;
        };
        const closelistDanger = () => {
            showlistDanger.value = false;
        };
        const selectUser = (tpoid: any) => {
            selectedUser.value = tpoid;
        };

        

        const selectingCompany = async (companyid: any) => {
            const existInUser = userCompanies.value.some(({ id }) => id === companyid);
            const existToSave = companiesToSave.value.includes(companyid);
            const existToRemove = companiesToRemove.value.includes(companyid);
            const existInSelection = companiesMade.value.includes(companyid);

            if (existInSelection) {
                if (!existInUser && !existToSave) companiesToSave.value.push(companyid);
            } else {
                if (existInUser && !existToRemove) companiesToRemove.value.push(companyid);

                if (existToSave) {
                    companiesToSave.value = companiesToSave.value.filter(company => company !== companyid);
                }
            }
        };
        //validate if all companies are selected
        const validateSelectAll = (companyId: number) => {
            if (companiesMade.value.length === companiesList.value.length) {
                selectAll.value = true;
            } else {
                selectAll.value = false;
                selectingCompany(companyId);
            }
        };


        const getUsers = async () => {
            loadings.loadingUsers = true;
            try {
                searchLoading.value = true;
                const resp = await store.dispatch(
                    'DELEGATEUSERS/getSearchUsers',
                    NewUser.value.userName
                );
                resp.users.forEach((user: any) => user.mail !== null ? user.mail = user.mail.toLowerCase() : null);
                users.value = resp.users;
                searchLoading.value = false;
                didSearch.value = true;
                showlistDanger.value = false;
            } catch (error) {
                searchLoading.value = false;
                users.value = [{ oid: 0, name: 'No users list' }];
                showlistDanger.value = true;
            }
            loadings.loadingUsers = false;
        };

        const getOtherPrograms = async () => {
            try {

                otherProgramsList.value = [];
                const programTemporary: any = allProgramList.value;
                const filterForClient = new Set();

                if (form.locations.length > 0 && form.clients.length === 0) {
                    await form.locations.forEach((location: number) => {
                        filterForClient.add(location);
                    });

                    otherProgramsList.value = programTemporary.filter((f: any) => {
                        const duplicate = filterForClient.has(f.data.location.id);
                        if (duplicate) {
                            return true;
                        }
                    });
                }

                if (form.clients.length > 0) {
                    await form.clients.forEach((client: number) => {
                        filterForClient.add(client);
                    });

                    otherProgramsList.value = programTemporary.filter((f: any) => {
                        const duplicate = filterForClient.has(f.data.client.id);
                        if (duplicate) {
                            return true;
                        }
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };

        const getOtherCompanyPrograms = async () => {
            try {
                otherProgramsList.value = allProgramList.value;
            } catch (error) {
                console.error(error);
            }
        };

        const getCompanies = async () => {
            const params = {
                oid: selectedUserInfo.value.oid,
            };
            loadings.loadingCompanies = true;
            try {
                const getUserCompanies = await store.dispatch('DELEGATEUSERS/getUserCompany', params);
                companiesList.value = await store.dispatch('DELEGATEUSERS/getAdminCompanies');
                companiesMade.value = [];
                userCompanies.value = getUserCompanies;
                getUserCompanies.forEach((field: any) => {
                    companiesMade.value.push(field.id);
                });
                form.locations = [];
                form.clients = [];
                form.programs = [];
            } catch (error) {
                console.log(error);
            }
            loadings.loadingCompanies = false;
        };

        const unlockProfiles = async () => {
            NewUser.value.save = false;
            getCompanies();
        };

        const createScroll = () => {
            const listElm = document.querySelector('#programs-scroll') as HTMLElement;
            if (listElm) {

                listElm.addEventListener('scroll', async () => {

                    if (listElm.scrollHeight - listElm.scrollTop <= 500) {
                        if (currentPage < totalPages) {
                            const start = currentPage * paginatePrograms.value;
                            const end = (currentPage + 1) * paginatePrograms.value;
                            for (let i = start; i < end; i++) {
                                if (programsList.value[i]) {
                                    programsList.value[i]['visible'] = true;
                                }
                            }
                            currentPage += 1;
                        }
                    }

                });
            }
        };


        const getPrograms = async () => {
            loadings.loadingPrograms = true;
            try {
                form.programs = [];
                const programTemporary: any = allProgramList.value;
                const filterForClient = new Set();

                await form.clients.forEach((client: number) => {
                    filterForClient.add(client);
                });

                programsList.value = programTemporary.filter((f: any) => {
                    const duplicate = filterForClient.has(f.data.client.id);
                    if (duplicate) {
                        return true;
                    }
                });


                programsList.value.map((program: any) => {
                    if (program.asigned) {
                        form.programs.push(program.id);
                    }
                });
                loadings.loadingPrograms = false;
                if (programsList.value.length > 0) {
                    if (programsList.value.length > paginatePrograms.value) {
                        for (let i = 0; i < paginatePrograms.value; i++) {
                            programsList.value[i]['visible'] = true;
                        }
                        totalPages = Math.round(programsList.value.length / paginatePrograms.value);
                        currentPage = 1;
                    } else {
                        programsList.value = programsList.value.map((program: any) => {
                            program['visible'] = true;
                            return program;
                        });
                        totalPages = 1;
                        currentPage = 1;
                    }
                    createScroll();
                } else {
                    form.programs = [];
                    selectAllPrograms.value = false;
                    loadings.loadingPrograms = false;
                }
            } catch (error) {
                console.error(error);
            }
            getOtherPrograms();
        };

        const getClients = async () => {
            loadings.loadingClients = true;
            try {
                form.clients = [];
                form.programs = [];
                const clientTemporary: any = allClientList.value;
                const filterForLocation = new Set();

                await form.locations.forEach((location: number) => {
                    filterForLocation.add(location);
                });

                clientsList.value = clientTemporary.filter((f: any) => {
                    const duplicate = filterForLocation.has(f.data.location.id);
                    if (duplicate) {
                        return true;
                    }
                });

                clientsList.value.map((client: any) => {
                    if (client.asigned) {
                        form.clients.push(client.id);
                    }
                });
                if (form.clients.length > 0) {
                    getPrograms();
                }
            } catch (error) {
                console.error(error);
            }
            loadings.loadingClients = false;
            getOtherPrograms();
        };

        const getLocations = async () => {
            loadings.loadingLocations = true;
            try {
                locationsList.value = [];
                programsList.value = [];
                const locationTemporary: any = [];
                const filterUniqueLocation = new Set();
                const clientTemporary = [];
                const filterUniqueClient = new Set();
                const programTemporary = [];

                allScopesList.value = await store.dispatch('DELEGATEUSERS/getAllScopes', { idCompany: form.company, oid: selectedUserInfo.value.oid });



                for (let index = 0; index < allScopesList.value.length; index++) {
                    locationTemporary.push({ asigned: allScopesList.value[index].asigned, id: allScopesList.value[index].location.id, name: allScopesList.value[index].location.name, data: allScopesList.value[index] });
                    clientTemporary.push({ asigned: allScopesList.value[index].asigned, id: allScopesList.value[index].client.id, name: allScopesList.value[index].client.name, data: allScopesList.value[index] });
                    programTemporary.push({ asigned: allScopesList.value[index].asigned, id: allScopesList.value[index].program.id, name: allScopesList.value[index].program.name, data: allScopesList.value[index] });
                };


                locationsList.value = locationTemporary.filter((f: any) => {
                    const duplicate = filterUniqueLocation.has(f.id);
                    filterUniqueLocation.add(f.id);
                    if (!duplicate) {
                        return true;
                    }
                });

                allClientList.value = clientTemporary.filter((c: any) => {
                    const duplicate = filterUniqueClient.has(c.id);
                    filterUniqueClient.add(c.id);
                    if (!duplicate) {
                        return true;
                    }
                });

                allProgramList.value = programTemporary;

                locationsList.value.map((location: any) => {
                    if (location.asigned) {
                        form.locations.push(location.id);
                    }
                });
                if (form.locations.length > 0) {
                    getClients();
                }
            } catch (error) {
                console.error(error);
            }
            loadings.loadingLocations = false;
            getOtherCompanyPrograms();
        };



        const funcSelectAllClients = () => {
            form.clients = [];
            if (selectAllClients.value) {
                form.clients = clientsList.value.map(client => client.id);
            }
            getPrograms();
        };

        const funcSelectAllLocations = () => {
            form.locations = [];
            if (selectAllLocations.value) {
                form.locations = locationsList.value.map(location => location.id);
            }
            getClients();
        };

        const funcSelectAllPrograms = () => {
            form.programs = [];
            if (selectAllPrograms.value) {
                form.programs = programsList.value.map(program => program.id);
            }
        };


        const saveUserCompanies = async () => {
            if (!companiesToSave.value.length) return;
            const params = {
                oid: selectedUserInfo.value.oid,
                content: { companies: companiesToSave.value }
            };

            try {
                await store.dispatch('DELEGATEUSERS/addUserCompany', params);
                hasErrorSave.value = false;
            } catch (error) {
                hasErrorSave.value = true;
                console.error('ERROR TO SAVE COMPANIES', error);
            }
        };

        const removeUserCompanies = async () => {
            if (!companiesToRemove.value.length) return;
            const params = {
                oid: selectedUserInfo.value.oid,
                content: { companies: companiesToRemove.value }
            };

            try {
                await store.dispatch('DELEGATEUSERS/removeUserCompany', params);
                hasErrorRemove.value = false;
            } catch (error) {
                hasErrorRemove.value = true;
                console.error('ERROR TO REMOVE COMPANIES', error);
            }
        };

        const saveChanges = async () => {
            loadings.savingData = true;
            const requests = [];
            if (companiesMade.value.length) {
                const params = {
                    oid: selectedUserInfo.value.oid,
                    content: { companies: props.userName || NewUser.value ? companiesAdd() : companiesMade.value }
                };
                if (params.content.companies.length) {
                    requests.push(store.dispatch('DELEGATEUSERS/addUserCompany', params));
                }
            }
            if ((props.userName || NewUser.value) && companiesToDelete().length) {

                const paramsDelete = {
                    oid: selectedUserInfo.value.oid,
                    content: { companies: companiesToDelete() }
                };
                requests.push(store.dispatch('DELEGATEUSERS/removeUserCompany', paramsDelete));

            }

            if (requests.length) {
                try {
                    await Promise.all(requests);
                    // success.value = true;
                } catch (error) {
                    // success.value = false;
                    console.error(error);
                }
            }

            loadings.savingData = false;
            step.value = 3;
        };

        const proceed = async () => {
            if (step.value === 1) {
                step.value = 2;
                unlockProfiles();
                return;
            }
            if (step.value === 2) {
                saveChanges();
                // step.value = 3;
                // saveUserCompanies();
                // removeUserCompanies();
                return;
            }
        };

        const userExists = () => {
            if (props.userName) {
                step.value = 2;
                selectedUser.value = props.userOID;
                NewUser.value.userName = props.userName;
                NewUser.value.oid = props.userOID;
                userAlreadySelected.value = true;
                unlockProfiles();
            }
        };

        //enable edit
        const enableEdit = () => {
            enableEditScopes.value = !enableEditScopes.value;
        };
        //toggle all function
        const toggleSelectAll = () => {
            if (selectAll.value) {
                companiesMade.value = companiesList.value.map((cp) => cp.id);
            } else {
                companiesMade.value = [];
            }
        };




        // --- Initialized functions -------------------------- 
        userExists();

        // --- RETURNS ----------------------------
        return {
            getUsers, NewUser, searchLoading, users, companiesList, selectAllCompanies,
            funcSelectAllClients, ...toRefs(form), v$, getClients, clientsList,
            selectAllClients, selectAllLocations, locationsList, getLocations, getPrograms, programsList,
            selectAllPrograms, funcSelectAllLocations, funcSelectAllPrograms,
            /*PostUserAdmin,*/ ...toRefs(loadings), userSelected, unlockProfiles,
            usersAdmin, searchLoadingAdmin,
            userAlreadySelected, didSearch, selectedUser, step, selectUser, proceed, transitionName, selectedUserInfo,
            close,
            showNotification, showSuccess, showDanger, closeSuccess, closeDanger, showlistDanger, closelistDanger,
            selectingCompany, companiesMade, hasErrorSave, hasErrorRemove, enableEditScopes, enableEdit, toggleSelectAll, selectAll, validateSelectAll, getNames, activeProceedButton, i18n
        };
    },
});
</script>

<style lang="scss" scoped>
.checklistscroll {
    border: 2px solid #ddd;
    border-radius: 10px;
    height: 350px;
    overflow-y: scroll;
}
</style>
