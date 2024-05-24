<template>
    <Accordion
        :title="
            selectedQty > 0 && selectedQty === modelData.length
                ? 'All selected'
                : `${selectedQty} selected`
        "
        :headClass="accordionClass"
        :disabled="modelData.length > 0 ? false : true"
        :isLoading="isLoading"
        @blur="$emit('blur')"
    >
        <DynamicScroller
            v-if="modelData.length"
            class="scroller"
            :items="modelData"
            :min-item-size="32"
            :key-field="keyField"
        >
            <template #before v-if="enableSelectAll">
                <div class="field mb-2">
                    <div class="control">
                        <Checkbox
                            status="is-pink"
                            v-model="selectAll"
                            :value="selectAll"
                            @change.self="selectAllModel($event)"
                        >
                            {{ selectAll ? "UNSELECT ALL" : "SELECT ALL" }}
                        </Checkbox>
                    </div>
                </div>
            </template>
            <template v-slot="{ item, index, active }">
                <DynamicScrollerItem
                    :item="item"
                    :active="active"
                    :size-dependencies="[item[descriptionField]]"
                    :data-index="index"
                >
                    <div class="checkbox-container py-2">
                        <Checkbox
                            :disabled="disabledBoxes[item[keyField]]"
                            status="is-pink"
                            :value="
                                valueCheckbox
                                    ? item[keyField]
                                    : modelDataRef[item[keyField]]
                            "
                            v-model="modelDataRef[item[keyField]].checked"
                            @change.self="updateModel($event)"
                        >
                            {{ item[descriptionField] }}
                        </Checkbox>
                    </div>
                </DynamicScrollerItem>
            </template>
        </DynamicScroller>
    </Accordion>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import Accordion from '@/components/Accordion.vue';

export default defineComponent({
    components: { Accordion },
    emits: ['update:modelValue', 'change', 'changeSelectAll', 'blur'],
    props: {
        descriptionField: { type: String, required: true, default: 'description' },
        // eslint-disable-next-line vue/require-valid-default-prop
        disableValues: { type: Object as PropType<number[]>, default: [] },
        enableSelectAll: { type: Boolean, default: false },
        isLoading: { type: Boolean, default: false },
        keyField: { type: String, required: true, default: 'id' },
        // eslint-disable-next-line vue/require-valid-default-prop
        modelData: { type: Object as PropType<any[]>, required: true, default: [] },
        toggleSelectAll: { type: Boolean, default: false },
        valueCheckbox: { type: Boolean, default: false },
        // eslint-disable-next-line vue/require-valid-default-prop
        modelValue: { type: Object as PropType<any[]>, default: [] },
    },
    setup (props, { emit }) {

        const accordionClass = {
            background: 'white',
            color: '#000',
            border: 'solid 1px #dbdbdb',
            'font-weight': 'normal',
        };
        const disabledBoxes = ref<any>({});
        const modelDataCopy = computed(() => props.modelData);
        const modelDataRef = ref<any>({});
        const selectAll = ref(false);
        const toggleSelectAllCopy = computed(() => props.toggleSelectAll);

        const getModelValues = () => Object.values(JSON.parse(JSON.stringify(modelDataRef.value)));
        const selectedQty = computed(() => getModelValues().filter((x: any) => x.checked).length);
        const verifySelectAll = () => {
            if (getModelValues().filter((x: any) => x.checked).length === props.modelData.length) {
                selectAll.value = true;
            } else {
                selectAll.value = false;
            }
        };

        const updateModel = (evt?: any) => {
            verifySelectAll();
            let updateCopy: any = getModelValues().filter((x: any) => x.checked);
            if (props.valueCheckbox) {
                updateCopy = updateCopy.map((x: any) => x[props.keyField]);
            } else {
                updateCopy = updateCopy.map((x: any) => {
                    delete x.checked;
                    return x;
                });
            }
            emit('update:modelValue', updateCopy);
            if (evt) {
                emit('change', evt);
            }
        };

        const selectAllModel = (evt?: unknown) => {
            if (evt) {
                if (selectAll.value) {
                    for (const key in modelDataRef.value) {
                        modelDataRef.value[key].checked = true;
                    }

                } else {
                    for (const key in modelDataRef.value) {
                        modelDataRef.value[key].checked = false;
                    }
                }
            }
            updateModel();
            if (evt) {
                emit('changeSelectAll', evt);
            }

        };

        const validateSelectedAll = () => {
            if (props.toggleSelectAll) {
                selectAll.value = true;
            } else {
                selectAll.value = false;
            }
            selectAllModel();
        };

        const buildModelOnDisabled = () => {
            props.disableValues.forEach((x: number | string) => {
                disabledBoxes.value[x] = true;
                if (modelDataRef.value[x]) {
                    modelDataRef.value[x].checked = true;
                }
            });
        };

        const buildInitData = () => {
            const copy = JSON.parse(JSON.stringify(props.modelData));
            modelDataRef.value = {};
            copy.forEach((x: object) => {
                const key = props.keyField as keyof typeof x;
                const id = x[key];
                modelDataRef.value[id] = x;
            });

            if (props.modelValue.length) {
                for (const key in modelDataRef.value) {
                    const find = props.modelValue.some((i: number | string | object) => {
                        if (typeof i === 'number' || typeof i === 'string') {
                            return Number(i) === Number(key) ? true : false;
                        } else {
                            const field = props.keyField as keyof typeof i;
                            return i[field] === Number(key) ? true : false;
                        }
                    });
                    if (find) {
                        modelDataRef.value[key].checked = true;
                    } else {
                        modelDataRef.value[key].checked = false;
                    }
                }
            }

            if (props.toggleSelectAll) {
                for (const key in modelDataRef.value) {
                    modelDataRef.value[key].checked = true;
                }
            }

            validateSelectedAll();
            buildModelOnDisabled();
        };

        watch(modelDataCopy, () => {
            buildInitData();
        });

        watch(toggleSelectAllCopy, () => {
            if (props.toggleSelectAll) {
                for (const key in modelDataRef.value) {
                    modelDataRef.value[key].checked = true;
                }

            } else {
                for (const key in modelDataRef.value) {
                    modelDataRef.value[key].checked = false;
                }
            }
            console.log(props.toggleSelectAll, ' watch props.toggleSelectAll ');
            updateModel();
        });

        buildInitData();

        return {
            accordionClass, selectAll, selectAllModel, modelDataRef, disabledBoxes,
            selectedQty, updateModel, verifySelectAll,
        };
    }
});
</script>

<style scoped>
.scroller {
    margin: 1.25rem;
    margin-right: 0;
    height: 180px;
    overflow-y: auto;
}

:deep .message-body {
    max-height: 200px !important;
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #e1e1e1;
    border-radius: 6px;
    box-shadow: none;
    color: #4a4a4a;
    display: block;
}

:deep .vue-recycle-scroller__item-view {
    text-align: left !important;
}
</style>
