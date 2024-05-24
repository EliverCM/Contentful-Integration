<template>
    <div class="modal is-active">
        <div class="modal-background" @click="close"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title"></p>
                <button class="delete" aria-label="close" @click="close"></button>
            </header>
            
            <section class="modal-card-body">
                <p class="title is-2 mb-2">Content Creator Detail HOLA MUCHACHOS</p>

                <transition :name="transitionName" mode="out-in">

                    <!-- step 1 -->
                    <div v-if="step == 1 && !userAlreadySelected" key="step1">
                        <p class="mb-6">First you will need to select the user that you wish to make a Content Creator for My Interests.</p>
                        <label class="label">User Name</label>
                        <div class="field has-addons">
                            <div class="control is-expanded">
                                <input 
                                    class="input" 
                                    type="text"
                                    placeholder="Find a user by name"
                                    v-model="NewUser.userName"
                                />
                            </div>
                            <div class="control">
                                <a 
                                    class="button is-black" 
                                    @click="getUsers()">
                                    Search User
                                </a>
                            </div>
                        </div>
                        <label class="label mt-5">Search Results</label>
                        <ul v-if="didSearch" class="mb-6">
                            <li v-for="user in users" :key="user.oid" class="is-selectable" :class="{ 'selected': selectedUser == user.oid}" @click="selectUser(user.oid)">
                                <p class="name has-text-weight-600">{{ user.name }}</p>
                                <p v-if="user.upn" class="tpid">{{ user.upn }}</p>
                                <p v-if="user.position_code_title" class="position-code-title">{{ user.position_code_title }}</p>
                            </li>
                        </ul>
                        <div v-else class="notification">
                            <p>Your search results will appear here.</p>
                        </div>
                        <div v-if="showlistDanger" class="notification is-danger is-light">
                            <button class="delete" @click="closelistDanger"></button>
                            Error listing users, <strong>try again.</strong>
                        </div>
                    </div>

                    <!-- step 2 -->
                    <div v-else key="step2">
                        <p class="mb-6">Here you can select the Global Business Objects that <strong>{{ selectedUserInfo.name }}</strong> will be able to choose from as an audience to publish content to.</p>
                        <label class="label">Selected User</label>
                        <ul class="is-search-results mt-2 mb-6">
                            <li class="is-selectable already-selected">
                                <p class="name has-text-weight-600">{{ selectedUserInfo.name }}</p>
                                <p class="tpid">{{ selectedUserInfo.upn }}</p>
                                <p class="position-code-title">{{ selectedUserInfo.position_code_title }}</p>
                            </li>
                        </ul>
                        <div v-if="showSuccess" class="notification is-success is-light">
                            <button class="delete" @click="closeSuccess"></button>
                            User permissions delegated successfully
                        </div>
                        <div v-if="showDanger" class="notification is-danger is-light">
                            <button class="delete" @click="closeDanger"></button>
                            An error has ocurred, <strong>try again.</strong>
                        </div>
                        <div v-show="showNotification" class="field mt-2">
                            <label class="label">Company</label>
                            <div class="control is-expanded">
                                <div class="select is-multiple is-fullwidth">
                                <wait v-if="loadingCompanies" style="min-height: 150px"/>
                                <select v-if="!loadingCompanies"
                                        style="height: 10em"
                                        class="is-loading"
                                        size="6"
                                        v-model="company"
                                        @change="
                                            getLocations()
                                        "
                                        >
                                    <option class="py-2 px-4"
                                        v-for="company in companiesList"
                                        :key="
                                            company.id
                                        "
                                        :value="
                                            company.id
                                        "
                                        :id="
                                            company.id
                                        "
                                    >
                                        {{
                                            company.name
                                        }}
                                    </option>
                                </select>
                                </div>
                            </div>
                        </div>
                        <div v-show="showNotification" class="field mt-2">
                            <label class="label">Locations</label>
                            <div class="control is-expanded">

                                <DropDown
                                    :placeholder="`${locations.length} Selected`"
                                    :isLoading="
                                        loadingLocations
                                    "
                                    :disabled="
                                        loadingLocations ||
                                        company === null
                                            ? true
                                            : false
                                    "
                                    @blur="
                                        v$.locations.$touch()
                                    "
                                >
                                    <div
                                        class="
                                            dropdown-item
                                            has-text-left
                                        "
                                    >
                                        <div class="field">
                                            <div
                                                class="
                                                    control
                                                "
                                            >
                                                <label
                                                    for="locations"
                                                    class="
                                                        is-clickable
                                                        is-block
                                                    "
                                                >
                                                    <input
                                                        id="locations"
                                                        type="checkbox"
                                                        v-model="
                                                            selectAllLocations
                                                        "
                                                        @change="
                                                            funcSelectAllLocations
                                                        "
                                                    />
                                                    <strong
                                                        class="
                                                            ml-1
                                                        "
                                                        >{{
                                                            selectAllLocations
                                                                ? "UNSELECT ALL"
                                                                : "SELECT ALL"
                                                        }}</strong
                                                    >
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        class="
                                            dropdown-item
                                            has-text-left
                                        "
                                        v-for="location in locationsList"
                                        :key="
                                            location.id
                                        "
                                    >
                                        <div class="field">
                                            <div
                                                class="
                                                    control
                                                "
                                            >
                                                <label
                                                    :for="
                                                        location.id
                                                    "
                                                    class="
                                                        is-clickable
                                                    "
                                                    style="
                                                        display: block;
                                                    "
                                                >
                                                    <input
                                                        :id="
                                                            location.id
                                                        "
                                                        type="checkbox"
                                                        v-model="
                                                            locations
                                                        "
                                                        :value="
                                                            location.id
                                                        "
                                                        @change="
                                                            getClients
                                                        "
                                                    />
                                                    {{
                                                        location.name
                                                    }}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </DropDown>

                                <!-- <div class="select is-fullwidth">
                                <select disabled>
                                    <option>Select a company</option>
                                </select>
                                </div> -->

                            </div>
                        </div>
                        <div v-show="showNotification" class="field mt-2">
                            <label class="label">Client</label>
                            <div class="control is-expanded">

                                <DropDown
                                    :placeholder="`${clients.length} Selected`"
                                    :isLoading="
                                        loadingClients
                                    "
                                    :disabled="
                                        !locations.length ||
                                        loadingClients
                                    "
                                    @blur="
                                        v$.clients.$touch()
                                    "
                                >
                                    <div
                                        class="
                                            dropdown-item
                                            has-text-left
                                        "
                                    >
                                        <div class="field">
                                            <div
                                                class="
                                                    control
                                                "
                                            >
                                                <label
                                                    for="clients"
                                                    class="
                                                        is-clickable
                                                        is-block
                                                    "
                                                >
                                                    <input
                                                        id="clients"
                                                        type="checkbox"
                                                        v-model="
                                                            selectAllClients
                                                        "
                                                        @change="
                                                            funcSelectAllClients
                                                        "
                                                    />
                                                    <strong
                                                        class="
                                                            ml-1
                                                        "
                                                        >{{
                                                            selectAllClients
                                                                ? "UNSELECT ALL"
                                                                : "SELECT ALL"
                                                        }}</strong
                                                    >
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        class="
                                            dropdown-item
                                            has-text-left
                                        "
                                        v-for="client in clientsList"
                                        :key="client.ident"
                                    >
                                        <div class="field">
                                            <div
                                                class="
                                                    control
                                                "
                                            >
                                                <label
                                                    :for="
                                                        client.id
                                                    "
                                                    class="
                                                        is-clickable
                                                    "
                                                    style="
                                                        display: block;
                                                    "
                                                >
                                                    <input
                                                        :id="
                                                            client.id
                                                        "
                                                        type="checkbox"
                                                        v-model="
                                                            clients
                                                        "
                                                        :value="
                                                            client.id
                                                        "
                                                        @change="
                                                            getPrograms
                                                        "
                                                    />
                                                    {{
                                                        client.name
                                                    }}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </DropDown>

                                <!-- <div class="select is-fullwidth">
                                <select disabled>
                                    <option>Select a client</option>
                                </select>
                                </div> -->

                            </div>
                        </div>
                        <div v-show="showNotification" class="field mt-2 mb-6">
                            <label class="label">Programs</label>
                            <div class="control is-expanded">

                                <DropDown
                                    :placeholder="`${programs.length} Selected`"
                                    :isLoading="
                                        loadingPrograms
                                    "
                                    :paginate="true"
                                    :disabled="
                                        !clients.length
                                    "
                                    @blur="
                                        v$.programs.$touch()
                                    "
                                >
                                    <div
                                        class="
                                            dropdown-item
                                            has-text-left
                                        "
                                    >
                                        <div class="field">
                                            <div
                                                class="
                                                    control
                                                "
                                            >
                                                <label
                                                    for="programs"
                                                    class="
                                                        is-clickable
                                                        is-block
                                                    "
                                                >
                                                    <input
                                                        id="programs"
                                                        type="checkbox"
                                                        v-model="
                                                            selectAllPrograms
                                                        "
                                                        @change="
                                                            funcSelectAllPrograms
                                                        "
                                                    />
                                                    <strong
                                                        class="
                                                            ml-1
                                                        "
                                                        >{{
                                                            selectAllPrograms
                                                                ? "UNSELECT ALL"
                                                                : "SELECT ALL"
                                                        }}</strong
                                                    >
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <template
                                        v-for="program in programsList"
                                        :key="program.id">
                                    <div
                                        class="
                                            dropdown-item
                                            has-text-left
                                        "

                                        v-if="program.visible"
                                    >
                                        <div class="field">
                                            <div
                                                class="
                                                    control
                                                "
                                            >
                                                <label
                                                    :for="
                                                        program.id
                                                    "
                                                    class="
                                                        is-clickable
                                                    "
                                                    style="
                                                        display: block;
                                                    "
                                                >
                                                    <input
                                                        :id="
                                                            program.id
                                                        "
                                                        type="checkbox"
                                                        v-model="
                                                            programs
                                                        "
                                                        :value="
                                                            program.id
                                                        "
                                                    />
                                                    {{
                                                        program.name
                                                    }}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    </template>
                                </DropDown>

                                <!-- <div class="select is-fullwidth">
                                <select disabled>
                                    <option>Select a location</option>
                                </select>
                                </div> -->

                            </div>
                        </div>
                    </div>
                </transition>
            </section>

            <footer class="modal-card-foot">
                <div class="columns is-mobile">
                    <div class="column is-narrow">
                        <button class="button is-black is-wide has-text-left" @click="step = 1" v-if="step == 2 && !userAlreadySelected">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                        </button>
                    </div>
                    <div class="column"></div>
                    <div class="column is-narrow">
                        <button class="button is-black is-wide has-text-right" :class="{ 'is-loading': savingData }" @click="proceed" :disabled="!selectedUser">
                            hola este es boton
                        </button>
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

export default defineComponent({
    name: 'NewsContentCreator',
    props: {
        userName: { type: String, default: ''},
        userOID: { type: String, default: ''},
        userUPN: { type: String, default: ''},
        userPosition: { type: String, default: ''}
    },
    emits: ['close'],
    setup (props, { emit }) {

        // --- VARIABLES --------------------------
        const userAlreadySelected = ref(false);
        const didSearch = ref(false);
        const selectedUser = ref('');
        const step = ref(1);
        const showSuccess = ref(false);
        const showDanger = ref(false);
        const showlistDanger = ref(false);
        const showNotification = ref(true);
        const store = useStore();
        const users = ref<Array<any>>([]);
        const searchLoading = ref(false);

        const usersAdmin = ref<Array<any>>([]);
        const searchLoadingAdmin = ref(false);

        const allScopesList = ref<Array<any>>([]);

        const companiesList = ref<Array<any>>([]);
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
        const paginatePrograms = ref(50);let totalPages = 0;
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

        const rules = {
            company: { required },
            clients: { required },
            locations: { required },
            programs: { required },
        };

        const v$ = useVuelidate(rules, form);


        // --- COMPUTED ---------------------------
        const transitionName = computed(() =>      {
            let name = 'slide-fade-right';

            if (step.value == 2)       {
                name = 'slide-fade-left';
            }

            // override the transition so we go directly to step 2 when editing
            if (user.value)          {
                name = 'none';
            }

            return name;
        });

        const selectedUserInfo = computed( () =>     {
            let user = { name: '', oid: '', upn: '', 'position_code_title': ''};

            if (selectedUser.value)        {
                if (userAlreadySelected.value) {
                    user = { name: props.userName, oid: props.userOID, upn: props.userUPN, 'position_code_title': props.userPosition};
                } else {
                    user = users.value.find(u => u.oid == selectedUser.value);
                }
                
            }

            return user;
        });
        // const statusDropdownClients = computed(() => {
        //     if (v$.value.clients.$dirty && v$.value.clients.$errors.length) {
        //         return 'danger';
        //     }
        //     if (v$.value.clients.$dirty && !v$.value.clients.$errors.length) {
        //         return 'success';
        //     }
        //     return '';
        // });

        // const statusDropdownLocations = computed(() => {
        //     if (v$.value.locations.$dirty && v$.value.locations.$errors.length) {
        //         return 'danger';
        //     }
        //     if (v$.value.locations.$dirty && !v$.value.locations.$errors.length) {
        //         return 'success';
        //     }
        //     return '';
        // });

        // const statusDropdownPrograms = computed(() => {
        //     if (v$.value.programs.$dirty && v$.value.programs.$errors.length) {
        //         return 'danger';
        //     }
        //     if (v$.value.programs.$dirty && !v$.value.programs.$errors.length) {
        //         return 'success';
        //     }
        //     return '';
        // });

        // --- FUNCTIONS -------------------------- 

        

        const close = () =>    {
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
        const selectUser = (tpoid: any) =>   {
            selectedUser.value = tpoid;
        };

        const getUsers = async () => {
            try {
                loadings.loadingUsers = true;
                searchLoading.value = true;
                const resp = await store.dispatch(
                    'DELEGATEUSERS/getSearchUsers',
                    NewUser.value.userName
                );
                resp.forEach((user: any) => user.mail !== null ? user.mail = user.mail.toLowerCase() : null);
                users.value = resp;
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
                    await form.locations.forEach( (location: number) => {
                        filterForClient.add(location);
                    });

                    otherProgramsList.value = programTemporary.filter( (f: any) => {
                        const duplicate = filterForClient.has(f.data.location.id);
                        if (duplicate) {
                            return true;
                        }
                    });
                }

                if (form.clients.length > 0) {
                    await form.clients.forEach( (client: number) => {
                        filterForClient.add(client);
                    });

                    otherProgramsList.value = programTemporary.filter( (f: any) => {
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
            // const params = {
            //     oid: NewUser.value.oid,
            // };
            loadings.loadingCompanies = true;
            try {
                companiesList.value = await store.dispatch('DELEGATEUSERS/getAdminCompanies');
                form.locations = [];
                form.clients = [];
                form.programs = [];
            } catch (error) {
                
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
                                if( programsList.value[i]) {
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

                await form.clients.forEach( (client: number) => {
                    filterForClient.add(client);
                });

                programsList.value = programTemporary.filter( (f: any) => {
                    const duplicate = filterForClient.has(f.data.client.id);
                    if (duplicate) {
                        return true;
                    }
                });


                programsList.value.map((program: { id: any ; asigned: any  }) => {
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

                await form.locations.forEach( (location: number) => {
                    filterForLocation.add(location);
                });

                clientsList.value = clientTemporary.filter( (f: any) => {
                    const duplicate = filterForLocation.has(f.data.location.id);
                    if (duplicate) {
                        return true;
                    }
                });

                clientsList.value.map((client: { id: any ; asigned: any  }) => {
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
                    locationTemporary.push({asigned: allScopesList.value[index].asigned, id: allScopesList.value[index].location.id, name: allScopesList.value[index].location.name, data: allScopesList.value[index] });
                    clientTemporary.push({asigned: allScopesList.value[index].asigned, id: allScopesList.value[index].client.id, name: allScopesList.value[index].client.name, data: allScopesList.value[index] });
                    programTemporary.push({asigned: allScopesList.value[index].asigned, id: allScopesList.value[index].program.id, name: allScopesList.value[index].program.name, data: allScopesList.value[index] });
                };


                locationsList.value = locationTemporary.filter( (f: any) => {
                    const duplicate = filterUniqueLocation.has(f.id);
                    filterUniqueLocation.add(f.id);
                    if (!duplicate) {
                        return true;
                    }
                });

                allClientList.value = clientTemporary.filter( (c: any) => {
                    const duplicate = filterUniqueClient.has(c.id);
                    filterUniqueClient.add(c.id);
                    if (!duplicate) {
                        return true;
                    }
                });

                allProgramList.value = programTemporary;

                locationsList.value.map((location: { id: any ; asigned: any  }) => {
                    if (location.asigned) {
                        form.locations.push(location.id);
                    }
                });
                if (form.locations.length > 0) {
                    getClients();
                }
            } catch (error) {
                console.log(error);
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

        const PostUserAdmin = async () => {
            loadings.savingData = true;
            try {
                const params = {
                    idcompany: form.company,
                    oid: selectedUserInfo.value.oid,
                    content: { program: form.programs },
                };
                if (form.programs.length === 0) {
                    params.content = { program: otherProgramsList.value };
                    params.content.program = params.content.program.map((program: { id: any }) => program.id);
                }
                await store.dispatch('DELEGATEUSERS/postUsersScope', params);
                showSuccess.value = true;
                showDanger.value = false;
                showNotification.value = false;
                v$.value.$reset();
                form.company = null;
                form.clients = [];
                form.locations = [];
                form.programs = [];
                selectAllClients.value = false;
                selectAllLocations.value = false;
                selectAllPrograms.value = false;

                clientsList.value = [];
                locationsList.value = [];
                programsList.value = [];
                // users.value = [{ oid: 0, name: 'No users list' }];

                // NewUser.value.userName = '';
                // NewUser.value.profiles = [{}];
                // NewUser.value = {};
                // NewUser.value.save = true;

            } catch (error) {
                showSuccess.value = false;
                showDanger.value = true;
                showNotification.value = false;
            }
            loadings.savingData = false;
        };

        const proceed = async () => {
            console.log('algo :>> ');
            if (step.value == 1)  {
                step.value = 2;
                unlockProfiles();
                return;
            }
            if (step.value == 2) {
                PostUserAdmin();
            }
        };

        const userExists = () => {
            if (props.userName)     {
                step.value = 2;
                selectedUser.value = props.userOID;
                NewUser.value.userName = props.userName;
                NewUser.value.oid = props.userOID;
                userAlreadySelected.value = true;
                unlockProfiles();
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
            PostUserAdmin, ...toRefs(loadings), userSelected, unlockProfiles,
            usersAdmin, searchLoadingAdmin,
            userAlreadySelected, didSearch, selectedUser, step, selectUser, proceed, transitionName, selectedUserInfo,
            close, 
            showNotification, showSuccess, showDanger, closeSuccess, closeDanger, showlistDanger, closelistDanger
        };
    },
    // mounted ()   {
    //     if (this.user)     {
    //         this.selectedUser = this.user;
    //         this.userAlreadySelected = true;
    //     }
    // },
    //     methods:
    //     {
    //         search ()    {
    //             this.didSearch = true;
    //         },
    //         selectUser (tpid)    {
    //             this.selectedUser = tpid;
    //         },
    //         proceed ()    {
    //             if (this.step == 1){
    //                 this.step = 2;
    //                 return;
    //             }
    //         }
    //     },
});
</script>

<style lang="scss" scoped>
</style>
