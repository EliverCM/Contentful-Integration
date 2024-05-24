<template>
    <div
        ref="modal"
        class="custom-modal"
        :class="claseModal"
        @keydown.esc="closeModal"
        tabindex="-1"
    >
        <button
            type="button"
            class="modal-close is-large"
            style="top: 5px"
            aria-label="close"
            @click="closeModal()"
        ></button>

        <div class="card" :class="claseCard">
            <div class="card-content">
                <div class="container">
                    <slot> </slot>
                    <!-- <NewsDetail :entry="entry" @backPage="closeModal" /> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
    name: 'FullModal',
    // props: { entry: { type: Object, require: true } },
    emits: ['close'],
  
    setup (_, { emit }) {
        const modal = ref();
        const claseModal = ref('');
        const claseCard = ref('');

        onMounted( () => {
            claseModal.value = 'modal-active';
            claseCard.value = 'card-active';
            modal.value.focus();
        });

        const closeModal = () => {
            claseModal.value = 'modal-out';
            claseCard.value = 'card-out';
            setTimeout(() => emit('close'), 250);
        };

        return { closeModal, modal, claseModal, claseCard };
    }
});
</script>

<style lang="scss" scoped>
.custom-modal {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(10, 10, 10, 0.86);
    width: 100vw;
    height: 100%;
    z-index: 30;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.card-active {
    transition: transform 0.5s ease;
    transform: translateY(-105%);
}

.modal-active {
    opacity: 1;
}

.card-out {
    transform: translateY(105%);
    transition: transform 0.5s ease;
}

.modal-out {
    opacity: 0;
    transition: opacity 0.5s ease;
}

.card {
    border-radius: 12px 12px 0 0;
    height: 95vh;
    width: 100vw;
    position: absolute;
    bottom: -100%;
    overflow: auto;
    /* transform: translateY(0); */
}
</style>