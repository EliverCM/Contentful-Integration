<template>
    <div v-show="allowed">
        <router-view />
    </div>
    <div v-show="!allowed">
        <wait overtop blur />
    </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, computed, onMounted } from 'vue';
import { useAppInsights } from '@/tools/appInsights';
import Wait from '@/components/Wait.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'App',
    components: {
        Wait
    },
    setup () {
        const store = useStore();
        const { locale, setLocaleMessage } = useI18n();
        const allowed = computed(() => store.getters.getAllowed);

        onMounted(async () => {
            // setup app insights
            useAppInsights().addTelemetryInitializer(item => {
                if (!item.tags) item.tags = [];
                item.tags['ai.user.authUserId'] = store.state.user.identityProfile.userPrincipalName;
            });
        });

        return { allowed };
    }
});
</script>

<style lang="scss">
@import "./style/font.css";
@import "../node_modules/bulma/sass/utilities/_all.sass";
@import "./style/account-style";

::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 20px;
}

::-webkit-scrollbar-thumb {
    background: lightgray;
    border-radius: 20px;
}

::-webkit-scrollbar-thumb:hover {
    background: #888;
}

html, body {
    height: 100vh;
    overflow: hidden;
    scroll-behavior: smooth;
}

body {
    overflow-y: auto;
}

.modal-enter-active,
.modal-leave-active {
    @include tablet {
        transition: opacity 0.3s;
    }

    @include mobile {
        .modal-background {
            transition: opacity 0.3s;
        }
        .modal-card {
            transition: transform 0.3s ease;
        }
    }
}
.modal-enter-from,
.modal-leave-to {
    @include tablet {
        opacity: 0;
    }

    @include mobile {
        .modal-background {
            opacity: 0;
        }
        .modal-card {
            transform: translateY(100%);
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.modal-background.waffle {
    z-index: 98;
    background: rgba(0, 0, 0, 0);
}

#waffle {
    position: absolute;
    z-index: 99;
    // $size: .75rem;
    $size: 0;
    top: $size;
    right: $size;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    $barSize: 63px;

    > figure {
        cursor: pointer;
        padding: 1rem;
        border-radius: 4px;
        height: $barSize;
        width: $barSize;
        display: flex;
        justify-content: center;
        align-items: center;

        svg rect {
            fill: #5d5d5d;
        }

        &:hover {
            svg rect {
                fill: #2e2e2e;
            }
        }

        &.is-on {
            svg rect {
                fill: #a00095;
            }
        }
    }

    .is-waffle-menu {
        $waffle-item-width: 83px;
        $waffle-item-gap: 20px;
        $waffle-items-in-row: 3;
        $waffle-menu-width: $waffle-item-gap +
            (($waffle-item-width + $waffle-item-gap) * $waffle-items-in-row);
        $local-divider-height: 1px;

        position: relative;
        top: 4px;
        right: 8px;
        box-shadow: -4px 4px 10px 0px rgba(0, 0, 0, 0.1);
        background: white;
        border-radius: 4px;
        width: $waffle-menu-width;
        max-height: 460px;

        .is-waffle-grid {
            padding: $waffle-item-gap 0 0 0;
            display: flex;
            flex-wrap: wrap;
        }

        .local {
            display: flex;
            flex-wrap: wrap;
            padding: calc(#{$waffle-item-gap} + #{$local-divider-height}) 0 0 0;
            position: relative;
            width: 100%;

            &::before {
                position: absolute;
                content: "";
                top: 0;
                // right: calc(#{$waffle-item-gap} / 2);
                // left: calc(#{$waffle-item-gap} / 2);
                right: 0;
                left: 0;
                height: $local-divider-height;
                background: #dddddd;
            }
        }

        .is-waffle-item {
            width: $waffle-item-width;
            flex: 0 0 $waffle-item-width;
            border-radius: 4px;
            background-color: white;
            padding: 5px;
            margin: 0 0 $waffle-item-gap $waffle-item-gap;
            transition: background-color 0.25s;
            cursor: pointer;

            &:hover {
                background-color: #f0f0f0;
            }

            a {
                color: #2e2e2e;
            }

            figure {
                $imgSize: 55px;

                width: $imgSize;
                height: $imgSize;
                margin: 0 auto;
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    max-height: $imgSize;
                    max-width: $imgSize;
                }
            }

            p {
                margin: 5px 0 0 0;
                padding: 0;
                text-align: center;
                font-size: 12px;
                font-weight: 500;
            }
        }
    }
}

// 2022 NEW
// just for devel
.dev {
    background: blue;
}
.is-tp-sidebar {
    background: #e2e2e6;
}
.dev-tall-thing {
    height: 10000px;
}
</style>

<style lang="scss" scoped></style>
