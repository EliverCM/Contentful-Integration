<template>
    <div
        class="
            is-flex
            is-justify-content-space-between
            is-align-items-center
            is-pulled-right
        "
    >
        <button class="toggle-favorite is-clickable" @click="toggle()">
            <FavoriteIcon
                class="toggle-favorite__icon"
                :class="iconClasses"
                @animationend="onIconAnimationEnds"
            />
            <transition name="favorite-particles-transition">
                <div v-if="animating" class="toggle-favorite__particles"></div>
            </transition>
        </button>
        <span class="has-text-basic is-size-6 has-text-weight-bold">
            {{ likesQty }}
        </span>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import FavoriteIcon from '@/components/FavoriteIcon.vue';
import { useStore } from 'vuex';

export default defineComponent({
    name: 'GiveLike',
    components: { FavoriteIcon },
    props: {
        id: { type: String, required: true },
    },
    setup (props) {
        const favorited = ref(false);
        const store = useStore();

        const animating = ref(false);
        const disableReaction = ref(false);
        const likesQty = ref<any>();
        const likesGlobal = computed(() => store.getters['NEWS/getLikes']);
        let oldLikes = 0;


        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let likesNumber: number;
        const transformLikes = () => {
            if (likesGlobal.value) {

                const findLikes = likesGlobal.value.find(
                    (component: any) => component.idcontent === props.id
                );

                if (findLikes) {
                    if ((findLikes.likes !== oldLikes && findLikes) || (findLikes.likes === 0 && oldLikes === 0)) {
                        favorited.value = findLikes.reacted;
                        likesNumber = findLikes.likes;
                        if (findLikes.likes > 999 && findLikes.likes < 1000000) {
                            likesQty.value =
                                (Number(findLikes.likes) / 1000).toFixed(1) + 'K';
                        }
                        if (findLikes.likes >= 1000000) {
                            likesQty.value =
                                (findLikes.likes / 1000000).toFixed(1) + 'M';
                        }
                        if (findLikes.likes < 999) {
                            likesQty.value = findLikes.likes;
                        }

                        animating.value = true;
                    }
                    oldLikes = findLikes.likes;
                }
            }

        };

        const iconClasses = computed(() => {
            return {
                'toggle-favorite__icon--favorited': favorited.value,
                'toggle-favorite__icon--animate': animating.value
            };
        });

        watch(likesGlobal, () => {
            transformLikes();
        });

        const toggle = async () => {
            // Only animate on favoriting.
            if (!disableReaction.value) {
                disableReaction.value = true;
                if (!favorited.value) {
                    animating.value = true;
                }
                favorited.value = !favorited.value;
                setTimeout(() => {
                    disableReaction.value = false;
                }, 2500);
                const like = favorited.value ? 2 : 0;
                likesQty.value =
                    like === 2 ? likesQty.value + 1 : likesQty.value - 1;
                const payload = {
                    idcontent: props.id,
                    likes: likesQty.value,
                    reacted: favorited.value
                };
                await store.dispatch('NEWS/updateLikes', payload);
                try {
                    await store.dispatch('NEWS/giveLike', {
                        id: props.id,
                        reaction: like
                    });
                    const payload = {
                        idcontent: props.id,
                        likes: likesQty.value,
                        reacted: favorited.value
                    };
                    await store.dispatch('NEWS/updateLikes', payload);
                    transformLikes();
                } catch (error) {
                    console.error(error);
                }
            }
        };

        const onIconAnimationEnds = () => {
            animating.value = false;
        };

        transformLikes();

        return {
            iconClasses,
            toggle,
            onIconAnimationEnds,
            favorited,
            animating,
            likesQty,
            disableReaction
        };
    }
});
</script>

<style lang="scss" scoped>
$particles-animation-duration: 0.8s;
$icon-animation-duration: 0.48s;
$icon-color: hsl(1, 89%, 61%);
$icon-border-color: hsl(0, 0%, 10%);

.main-button {
    padding-left: 3px;
    padding-right: 3px;
}

@keyframes favorite-icon-animation {
    0% {
        opacity: 1;
        transform: scale(0.1);
    }

    50% {
        opacity: 1;
        transform: scale(1.1);
    }

    80% {
        opacity: 1;
        transform: scale(0.9);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes favorite-particles-animation {
    0% {
        background-position: left center;
    }
    100% {
        background-position: right center;
    }
}

// Particles animation.
.favorite-particles-transition-enter-active {
    background-image: url("/particles-sprite.png");
    background-size: 2500% auto;
    background-position: left center;
    background-repeat: no-repeat;

    animation-duration: $particles-animation-duration;
    animation-timing-function: steps(24);
    animation-name: favorite-particles-animation;
}

.toggle-favorite {
    font-size: 20px;
    position: relative;
    background: none;
    border: 0;
    padding-top: 4px;

    &__icon {
        &:hover {
            stroke: red;
        }
        height: 1em;
        width: 1em;

        // Transition mainly for when un-favoriting
        transition: fill-opacity 0.2s, stroke 0.2s;
        fill: $icon-color;
        fill-opacity: 0;
        stroke: $icon-border-color;

        &--favorited {
            fill-opacity: 1;
            stroke: $icon-color;
        }

        // Icon animation
        &--animate {
            opacity: 0;
            transform: scale(0);
            animation-duration: $icon-animation-duration;
            animation-delay: $particles-animation-duration -
                $icon-animation-duration;
            animation-name: favorite-icon-animation;
        }
    }

    &__particles {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 3em;
        height: 3em;
    }
}
</style>
