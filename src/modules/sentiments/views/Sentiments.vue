<template>
    <div class="modal is-active">
        <div class="modal-background" @click="closeModal"></div>
        <div class="modal-content">
            <div class="box is-borderless p-6">
                <div class="columns is-gapless is-mobile">
                    <div class="column"></div>
                    <div class="column-is-narrow">
                        <button
                            class="delete"
                            aria-label="close"
                            @click="closeModal"
                        ></button>
                    </div>
                </div>
                <div>
                    <!-- the content goes here -->
                    <div
                        v-if="!canChangeEmotion && !successPost && !isLoading"
                        class="has-text-centered"
                    >
                        <header class="modal-card-head"></header>
                        <section class="modal-card-body has-text-centered">
                            <p
                                class="modal-card-title has-text-centered has-text-weight-bold"
                            >{{$t('MYINTEREST.sentiments.views.sentiments.thanksforsharing')}}
                            </p>
                        </section>
                        <footer class="modal-card-foot"></footer>
                    </div>
                    <div v-if="!isLoading">
                        <form @submit.prevent="validate">
                            <div
                                v-if="
                                    !successPost &&
                                        canChangeEmotion &&
                                        !errorPost
                                "
                            >
                                <!-- title and emojis -->
                                <p class="title is-4">
                                    {{$t('MYINTEREST.sentiments.views.sentiments.howareyou')}}
                                </p>
                                <div class="columns is-mobile mb-5">
                                    <div
                                        v-for="(face, index) in faces"
                                        :key="index"
                                        class="column is-flex is-justify-content-center"
                                    >
                                        <fa
                                            @click="activeEmoji(index)"
                                            :class="
                                                face.selected
                                                    ? 'icon selected'
                                                    : 'icon is-large'
                                            "
                                            :icon="face.name"
                                        />
                                    </div>
                                </div>
                                <span v-if="v$.emotion.$errors.length">
                                    <!-- <p class="help is-danger" >Comments must be between 6 and 200 characters</p> -->
                                    <p class="help is-danger" v-for="($error, index) of v$.emotion.$errors" :key="index">
                                        {{ $error.$message }}
                                    </p>
                                </span>

                                <!-- this is the survey part -->
                                <div v-if="survey && emojiSelected === true">
                                    <!-- select the main reason why -->
                                    <div v-if="survey && emojiSelected">
                                        <div class="title is-5 mt-6 mb-1">
                                            {{$t('MYINTEREST.sentiments.views.sentiments.tellusmainreason')}}
                                        </div>
                                        <p class="is-size-6 mb-4">
                                            {{$t('MYINTEREST.sentiments.views.sentiments.contactfeedback')}}
                                        </p>
                                        <div class="buttons mb-6">
                                            <button
                                                type="button"
                                                @click="selectReason(reason)"
                                                v-for="reason in reasons"
                                                :key="reason.idSentimentsReason"
                                                :class="
                                                    reason.selected
                                                        ? 'button is-small is-pink'
                                                        : 'button is-small is-light'
                                                "
                                            >
                                                {{ reason.descReason }}
                                            </button>
                                        </div>
                                    </div>

                                    <!-- select the sub reasons why -->
                                    <div v-if="reasonSelected">
                                        <div class="title is-6 mt-6 mb-3">
                                            {{$t('MYINTEREST.sentiments.views.sentiments.pleasedetail')}}
                                        </div>
                                        <div class="buttons mb-6">
                                            <div
                                                @click="
                                                    selectSubReason(subReason)
                                                "
                                                v-for="subReason in subReasons"
                                                :key="subReason.idsentimentsSub"
                                                :class="
                                                    subReason.selected
                                                        ? 'button is-small is-pink'
                                                        : 'button is-small is-light'
                                                "
                                            >
                                                {{ subReason.descSubReason }}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- area to add a comment -->
                                    <div v-if="commentBox">
                                        <textarea
                                            class="textarea"
                                            placeholder="{{$t('MYINTEREST.sentiments.views.sentiments.typecomments')}}"
                                            v-model="FORM.comments"
                                            @blur="v$.comments.$touch()"
                                            @keydown.space="
                                                FORM.comments = validateSpaces
                                            "
                                        ></textarea>
                                        <!-- <textarea class="textarea" placeholder="Type here your comments" v-model="FORM.comments"></textarea> -->
                                        <span v-if="v$.comments.$errors.length">
                                            <!-- <p class="help is-danger" >Comments must be between 6 and 200 characters</p> -->
                                            <p
                                                class="help is-danger"
                                                v-for="($error, index) of v$
                                                    .comments.$errors"
                                                :key="index"
                                            >
                                                {{ $error.$message }}
                                            </p>
                                        </span>
                                    </div>

                                    <!-- checkbox if you want to be contacted -->
                                    <div class="mt-4">
                                        <div v-if="canCreateTpClient && survey">
                                            <label class="checkbox">
                                                <input
                                                    type="checkbox"
                                                    class="is-primary"
                                                    v-model="FORM.contacted"
                                                    :change="setContact()"
                                                />
                                                <strong class="pl-4"
                                                    >{{$t('MYINTEREST.sentiments.views.sentiments.havequestion')}}</strong
                                                >
                                            </label>
                                        </div>

                                        <p
                                            v-if="!canCreateTpClient"
                                            class="pl-4"
                                        >{{$t('MYINTEREST.sentiments.views.sentiments.alreadyopencase')}}
                                        </p>
                                    </div>
                                </div>

                                <!-- the submit button -->
                                <div class="buttons is-right">
                                    <button
                                        class="button is-black"
                                        :class="{ 'is-loading': submiting }"
                                        :disabled="v$.$invalid || submiting"
                                        type="submit"
                                    >{{$t('MYINTEREST.sentiments.views.sentiments.submit')}}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div id="loading" v-if="isLoading">
                        <wait overtop transparent />
                    </div>

                    <!-- this section is after a successful submission -->
                    <div v-if="successPost">
                        <section
                            class="shas-text-centered is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
                        >
                            <!-- <figure class="image sentimentsModal is-inline-block "> -->
                            <figure class="image sentimentsModal">
                                <img src="@/assets/icons/sentimentsModal.png" />
                            </figure>

                            <p class="is-size-4 has-text-weight-700 mt-6 mb-2">
                                {{$t('MYINTEREST.sentiments.views.sentiments.thankyoulettingus')}}
                            </p>

                            <div v-if="numberTicket != 0">
                                <p>{{$t('MYINTEREST.sentiments.views.sentiments.newcasenumber')}}
                                    <b class="caseNumber">{{
                                        ' ' + numberTicket
                                    }}</b>
                                </p>
                            </div>

                            <p
                                v-if="
                                    phoneNumber !== null &&
                                        phoneNumber !== undefined &&
                                        phoneNumber !== '' &&
                                        phoneNumber !== '0'
                                "
                                class="urgentText"
                            >{{$t('MYINTEREST.sentiments.views.sentiments.callHR', ( phoneNumber = phoneNumber))}}
                            </p>
                            <p v-else class="urgentText">
                                {{$t('MYINTEREST.sentiments.views.sentiments.urgentcontact')}}
                            </p>
                        </section>
                        <div class="buttons is-right mt-6">
                            <button
                                class="button is-black"
                                @click="closeModal()"
                                type="submit"
                            >
                            {{$t('MYINTEREST.sentiments.views.sentiments.close')}}
                            </button>
                        </div>
                    </div>

                    <div v-if="errorPost">
                        <div class="notification is-danger is-light">
                            <p>{{ errorMessage }}</p>
                        </div>
                    </div>

                    <!-- the content ends here -->
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import {
    computed,
    defineComponent,
    onBeforeMount,
    reactive,
    ref,
} from 'vue';
import { Subreasons, Reasons, Scores } from '@/modules/sentiments/store/types';
import useVuelidate from '@vuelidate/core';
import { minLength, minValue, required, helpers, maxLength } from '@vuelidate/validators';
import moment from 'moment';
import { useI18n } from 'vue-i18n';

//wait component
import Wait from '@/components/Wait.vue';

export default defineComponent({
    name: 'SentimentModal',
    emits: ['close'],
    components: { Wait },
    setup (_, { emit }) {
        const store = useStore();
        const i18n = useI18n();
        const survey = computed(() => store.getters['SENTIMENTS/getSurvey']);
        const commentBox = computed(
            () => store.getters['SENTIMENTS/getCommentBox']
        );
        const phoneNumber = computed(
            () => store.getters['SENTIMENTS/getPhoneNumber']
        );
        const reasonSelected = ref(false);
        const isLoading = ref<boolean>(true);
        let allSubReasons: Subreasons[] = [];
        const faces = ref<Scores[]>([]);
        const reasons = ref<Reasons[]>([]);
        const subReasons = ref();
        const submiting = ref(false);
        const errorMessage = ref();
        const emojiSelected = ref<boolean>(false);
        const successPost = ref<boolean>(false);
        const errorPost = ref<boolean>(false);
        const numberTicket = ref<number>(0);
        let subreasonsSelected;

        const emotionDate = computed(
            () => store.getters['SENTIMENTS/getActiveEmotion'].datetimecreated
        );
        
        const timezone = computed(
            () => store.getters['user/getIdentityProfile'].ccms[0].location.timezone
        );

        const canCreateTpClient = ref<boolean>(true);
        const canChangeEmotion = ref<boolean>(true);

        const today = new Date();

        const FORM = reactive({
            emotion: 0,
            reason: '',
            subReasons: [],
            contacted: false,
            comments: '',
            emotionCtr: 0,
            subReasonsTitle: ''
        });
        const commentsLengthError =
            'Comments must be between 6 and 200 characters';
        const rules = computed(() => {
            const commentsRequired = {
                emotion: { 
                    required,
                    minValue:  helpers.withMessage('Please select a emoji', minValue(1)) },
                reason: { required },
                subReasons: { required },
                contacted: { required },
                comments: {
                    required: helpers.withMessage(
                        'Comments are required',
                        required
                    ),
                    minLength: helpers.withMessage(
                        commentsLengthError,
                        minLength(6)
                    ),
                    maxLength: helpers.withMessage(
                        commentsLengthError,
                        maxLength(200)
                    )
                }
            };

            const commentsNonRequired = {
                emotion: { 
                    required,
                    minValue:  helpers.withMessage('Please select a emoji', minValue(1)) },
                reason: { required },
                subReasons: { required },
                contacted: { required },
                comments: {
                    minLength: helpers.withMessage(
                        commentsLengthError,
                        minLength(6)
                    ),
                    maxLength: helpers.withMessage(
                        commentsLengthError,
                        maxLength(200)
                    )
                }
            };

            const noSurvey = {
                emotion: { required }
            };
            if (!survey.value) {
                return noSurvey;
            } else if (survey.value && FORM.contacted) {
                return commentsRequired;
            } else {
                return commentsNonRequired;
            }
        });

        // Build Form
        const v$ = useVuelidate(rules, FORM);

        const closeModal = async () => {
            successPost.value = false;
            errorPost.value = false;
            await store.dispatch('SENTIMENTS/openEmotions', false);
            emit('close');
        };

        const syncEmotions = () => {
            if (
                moment(emotionDate.value).format('YYYY-MM-DD') ===
                moment(today).format('YYYY-MM-DD')
            ) {
                canChangeEmotion.value = false;
            } else {
                canChangeEmotion.value = true;
            }
        };

        const activeEmoji = (index = 0) => {
            faces.value[index].selected = true;

            faces.value.forEach((e: Scores, idx: number) => {
                if (idx !== index) {
                    delete e.selected;
                }
            });
            emojiSelected.value = true;
            FORM.emotion = faces.value[index].id;
        };

        const openModal = async (index?: number) => {
            reasons.value.forEach((r: Reasons) => {
                r.selected = false;
            });

            subreasonsSelected = 0;

            FORM.emotion = 0;
            FORM.reason = '';
            FORM.subReasons = [];
            FORM.contacted = false;
            FORM.comments = '';
            FORM.subReasonsTitle = '';
            reasonSelected.value = false;

            if (canChangeEmotion.value) {
                activeEmoji(index);
            }
        };
        const loadEmotions = (emotions: any) => {
            faces.value = emotions;
        };
        const loadReasons = (reasonArray: any) => {
            const result = reasonArray;
            reasons.value = result[0].reasons;
            allSubReasons = result[0].subreasons;
            isLoading.value = false;
        };
        const loadCanCreate = (tpClient: any) => {
            try {
                canCreateTpClient.value = tpClient;
            } catch (error) {}
        };

        const selectReason = (reason: Reasons) => {
            subReasons.value = [];
            subreasonsSelected = [];
            reasons.value.forEach((r: Reasons) => {
                if (r.idSentimentsReason == reason.idSentimentsReason) {
                    r.selected = true;
                } else {
                    r.selected = false;
                }
            });
            reasonSelected.value = true;
            const filter = allSubReasons.filter(
                subReason => subReason.reason === reason.idSentimentsReason
            );
            subReasons.value = JSON.parse(JSON.stringify(filter));
            FORM.reason = reason.descReason;
        };

        const selectSubReason = (subReason: Subreasons) => {
            subreasonsSelected = subReasons.value.filter(
                (sub: Subreasons) => sub.selected
            ).length;
            const index = subReasons.value.findIndex(
                (s: Subreasons) =>
                    s.idsentimentsSub === subReason.idsentimentsSub
            );
            if (subReasons.value[index].selected) {
                subReasons.value[index].selected = false;
            } else if (subreasonsSelected < 3) {
                subReasons.value[index].selected = true;
            } else {
                return;
            }
            FORM.subReasons = subReasons.value
                .filter((sub: Subreasons) => sub.selected)
                .map((sub: Subreasons) => sub.idsentimentsSub);
            FORM.subReasonsTitle = subReasons.value
                .filter((sub: Subreasons) => sub.selected)
                .map((sub: Subreasons) => sub.descSubReason);
        };

        const validate = async () => {
            submiting.value = true;
            v$.value.$validate();
            let postSurvey;
            if (survey.value) {
                postSurvey = {
                    idemotion: FORM.emotion,
                    subreasons: FORM.subReasons.map((s: number) => s),
                    subreasonsTitle: FORM.subReasonsTitle,
                    survey: [FORM.contacted,'',FORM.comments],
                    timezone: timezone.value,
                };
            } else {
                postSurvey = {
                    idemotion: FORM.emotion,
                    subreasons: [[0]],
                    survey: [false, '', ''],
                    timezone: timezone.value,
                };
            }
            if (FORM.emotion > 0) {
                try {
                    const post = await store.dispatch(
                        'SENTIMENTS/sendSurvey',
                        postSurvey
                    );
                    if (post.result?.codError === 0) {
                        // cambiar el state de emotion
                        if (post.result && post.result.caseNumber) {
                            numberTicket.value = post.result.caseNumber;
                        }
                        successPost.value = true;

                        syncEmotions();
                    } else if (post.result?.codError === 2) {
                        errorPost.value = true;
                        errorMessage.value = 'Cant change your Emotion right now';
                    } else {
                        errorPost.value = true;
                        errorMessage.value = 'An error has ocurred, try again';
                    }
                } catch (error) {
                    errorPost.value = true;
                    errorMessage.value = 'An error has ocurred, try again';
                } finally {
                    submiting.value = false;
                }
            } else {
                errorPost.value = true;
                errorMessage.value = 'Error P#10001'+ faces.value.toString();
                submiting.value = false;
            }
        };

        const setContact = () => {
            v$.value.$touch();
        };

        const validateSpaces = computed(() => {
            const text: string = FORM.comments;
            let texto = text;
            if (text) {
                texto = text.replace('  ', ' ');
            }

            return texto;
        });

        onBeforeMount(async () => {
            const syncEmotion = (await store.dispatch('SENTIMENTS/syncEmotions'));
            const getEmotions = (await store.dispatch('SENTIMENTS/getEmotionsList'));
            if (survey.value) {
                //simultaneous requests
                const getReasons = (await store.dispatch('SENTIMENTS/getReasons'));
                const getTpClient = (await store.dispatch('SENTIMENTS/getTpClient'));
                const querys = [syncEmotion, getEmotions, getReasons, getTpClient];
                const values = await Promise.all(querys);
                isLoading.value = false;
                syncEmotions();
                loadEmotions(values[1]);
                loadReasons(values[2]);
                loadCanCreate(values[3]);
                openModal(4);
            } else {
                //simultaneous requests
                const querys = [syncEmotion, getEmotions];
                const values = await Promise.all(querys);
                isLoading.value = false;
                syncEmotions();
                loadEmotions(values[1]);
                openModal(4);
            }
        });

        return {
            faces,
            survey,
            openModal,
            reasons,
            subReasons,
            selectReason,
            reasonSelected,
            selectSubReason,
            activeEmoji,
            emojiSelected,
            v$,
            FORM,
            validate,
            setContact,
            validateSpaces,
            numberTicket,
            canCreateTpClient,
            successPost,
            submiting,
            errorPost,
            canChangeEmotion,
            errorMessage,
            phoneNumber,
            closeModal,
            commentBox,
            isLoading,
            Wait,
            i18n
        };
    }
});
</script>

<style lang="scss" scoped>
#loading {
    min-height: 275px;
}
.modal-card {
    max-height: 80vh;
}

@keyframes pulse-shrink {
    to {
        -webkit-transform: scale(0.9);
        transform: scale(0.9);
    }
}

.face {
    // margin: 5px;
    height: 35px;
    width: 100%;
    padding: 0;
    text-align: center !important;
    transition-duration: 0.4s;
    .icon {
        width: 35px;
        height: 35px;
    }
}
.selected {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50% !important;
    // box-shadow: 0 12px 12px -10px rgba(160, 0, 149, 1);

    // -webkit-box-shadow: 0 20px 20px -10px rgba(160, 0, 149, 1);
    // -moz-box-shadow: 0 20px 20px -10px rgba(160, 0, 149, 1);
    // box-shadow: 0 20px 20px -10px rgba(160, 0, 149, 1);

    transform: scale(1.2);
    animation-name: pulse-shrink;
    animation-duration: 0.5s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: alternate;

    -webkit-transform: scale(1.2);
    -webkit-animation-name: pulse-shrink;
    -webkit-animation-duration: 0.5s;
    -webkit-animation-timing-function: linear;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-direction: alternate;
}
.sentiments-content {
    @media (max-width: 425px) {
        width: 375px;
    }
}

.fa-grin-alt {
    color: #01826c;

    // border: #a00095 solid 2px !important;
}
.fa-meh {
    color: #fadd6e;
}
.fa-frown {
    color: #ed8605;
}
.fa-sad-tear {
    color: #eb0028;
}
.fa-tired {
    color: #cc0001;
}

.disabledFace {
    color: #8f9bb3 !important;
}

@keyframes pulse-shrink {
    to {
        -webkit-transform: scale(0.9);
        transform: scale(0.9);
    }
}

@-webkit-keyframes pulse-shrink {
    to {
        -webkit-transform: scale(0.9);
        transform: scale(0.9);
    }
}

.fa-meh:hover,
.fa-grin-alt:hover,
.fa-frown:hover,
.fa-tired:hover,
.fa-sad-tear:hover {
    transform: scale(1.2);
    transition-duration: 0.3s;
    transition-property: box-shadow, transform;
    border-radius: 50%;
}
.fa-meh:not(:hover),
.fa-grin-alt:not(:hover),
.fa-frown:not(:hover),
.fa-tired:not(:hover),
.fa-sad-tear:not(:hover) {
    transition-duration: 0.4s;
}

// .subSelected {
//     background-color: #a00095;
//     color: white;
// }

// .subReasons .button:hover {
//     background-color: #a00095 !important;
//     color: white;
// }

.sentimentsModal {
    height: 200px;
    width: 200px;
}

.caseNumber {
    color: #a00095;
}
</style>
