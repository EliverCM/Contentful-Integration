<template>
    <article class="message" tabindex="0" ref="accordionContent">
        <div
            v-if="!button"
            class="message-header is-clickable"
            :class="{ 'message-header-loading': disabled || isLoading }"
            :style="headClass"
            @click="toggleAccordion"
        >
            <slot name="titleSlot" v-if="customHeader"> </slot>
            <div v-else>
                {{ title }}
            </div>
            <span
                class="arrow is-pulled-right"
                :class="showContent ? 'arrow-left' : 'arrow-down'"
            >
                <!-- <span class="button is-loading loading-button"></span> -->
                <span
                    v-if="isLoading"
                    class="button is-loading loading-button"
                ></span>
                <fa v-else icon="angle-down" />
            </span>
        </div>

        <button
            v-if="button"
            class="button is-clickable is-small is-white has-text-primary mb-3"
            type="button"
            @click="toggleAccordion"
        >
            <span class="mr-2">{{ title }}</span>
        </button>

        <transition
            name="accordion"
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
        >
            <div v-if="showContent" class="message-body is-dark">
                <slot></slot>
            </div>
        </transition>
    </article>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
export default defineComponent({
    emits: ['blur'],
    name: 'Accordion',
    props: {
        title: String,
        headClass: Object,
        button: {
            type: Boolean,
            default: false,
        },
        customHeader: {
            type: Boolean,
            default: false,
        },
        openAccordion: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        isLoading: { type: Boolean, default: false }
    },
    setup (props, { emit }) {

        // --- Variables -------------------------------------
        const showContent = ref(false);
        const blurAdded = ref(false);
        const accordionContent = ref();

        // --- Functions -------------------------------------
        const toggleAccordion = () => {
            if (!props.disabled && !props.isLoading) {

                showContent.value = !showContent.value;
                if (showContent.value) {
                    // accordionContent.value.focus();
                    if (!blurAdded.value) {
                        accordionContent.value.addEventListener('blur', () => {
                            emit('blur');
                            blurAdded.value = true;
                            showContent.value = false;
                        });

                    }
                }
            };
        };

        const enter = (element: HTMLStyleElement) => {

            const height = getComputedStyle(element).height;
            element.style.height = '0';

            // Force repaint to make sure the
            // animation is triggered correctly.
            getComputedStyle(element).height;

            // Trigger the animation.
            // We use `requestAnimationFrame` because we need
            // to make sure the browser has finished
            // painting after setting the `height`
            // to `0` in the line above.
            requestAnimationFrame(() => {
                element.style.height = height;
            });
        };

        const afterEnter = (element: HTMLStyleElement) => {
            element.style.height = 'auto';
        };

        const leave = (element: HTMLStyleElement) => {
            const height = getComputedStyle(element).height;
            element.style.height = height;

            // Force repaint to make sure the
            // animation is triggered correctly.
            getComputedStyle(element).height;

            requestAnimationFrame(() => {
                element.style.height = '0';
            });
        };

        watch(props, () => {
            if (props.openAccordion) {
                toggleAccordion();
            }
        });

        // --- Returns -------------------------------------
        return { showContent, toggleAccordion, enter, afterEnter, leave, accordionContent };
    }
});
</script>

<style lang="scss" scoped>
.message-header-loading {
    opacity: 0.4;
    cursor: not-allowed !important;
}
.message-body {
    margin-top: 2px;
    padding: 0;
    max-height: 600px;
    overflow: auto;
}

.is-closed .message-body {
    height: 0;
}

// --- Animation arrow ---------------------------
.arrow-down {
    transform: rotate(0deg);
    transition: all 0.5s ease;
}

.arrow-left {
    transform: rotate(90deg);
    transition: all 0.5s ease;
}
// --- END Animation arrow ------------------------

// --- Animation accordion ------------------------
.accordion-enter,
.accordion-leave-to {
    height: 0;
}

.accordion-enter-active,
.accordion-leave-active {
    transition: all 0.5s ease;
}

.loading-button {
    border: none;
    height: 10px;
    padding-right: 0;
    margin-top: 4px;
}
// --- END Animation accordion ---------------------
</style>