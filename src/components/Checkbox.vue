<template>
    <label class="is-flex" :class="disabled ? 'is-notAllowed' : 'is-clickable'">
        <div class="checkbox-custom mr-1">
            <input
                type="checkbox"
                v-bind="$attrs"
                v-model="refProp"
                :value="$attrs.value"
                :disabled="disabled"
                @input="updateValue"
            />
            <span
                v-if="!disabled"
                class="checkmark"
                :class="`has-background-${status}`"
                :style="{
                    border: !disabled ? '2px solid #d1d1d1' : 'none',
                }"
            ></span>
            <span
                v-else
                class="checkmark disabled has-text-centered has-text-white"
            >
                <fa v-if="$attrs.value" icon="check" />
            </span>
        </div>
        <slot></slot>
    </label>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';

export default defineComponent({
    name: 'Checkbox',
    props: {
        status: { type: String, default: 'grey' },
        disabled: { type: Boolean, default: false },
        modelValue: { type: [Array, Object, String, Number, Boolean] },
    },
    setup (props, { emit }) {
        const refProp = ref();
        const updateValue = (() => {
            emit('update:modelValue', refProp.value);
        });

        watchEffect(() => {
            refProp.value = props.modelValue;
        });

        return { updateValue, refProp };
    }
});
</script>

<style lang="scss" scoped>
.checkbox-custom {
    display: inline-block;
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.checkbox-custom .checkmark {
    width: 100%;
    height: 100%;
    min-width: 20px;
    min-height: 20px;
    // border: 2px solid #d1d1d1;
    display: inline-block;
    border-radius: 3px;
    background: #a00095
        url(https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/White_check.svg/1200px-White_check.svg.png)
        center/1250% no-repeat;
    transition: background-size 0.2s ease;
}

.checkbox-custom input:checked + .checkmark {
    background-size: 60%;
    transition: background-size 0.25s cubic-bezier(0.7, 0, 0.18, 1.24);
}

.checkbox-custom input:disabled + .disabled {
    cursor: not-allowed;
    background: #d1d1d1;
    background-size: 0.25s cubic-bezier(0.7, 0, 0.18, 1.24);
    border: 1px solid #d1d1d1;
    transition: background-size 0.25s cubic-bezier(0.7, 0, 0.18, 1.24);
}

.checkbox-custom input {
    display: none;
}

.has-background-is-pink {
    background-color: #ff0082 !important;
}
</style>