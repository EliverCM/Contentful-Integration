<template>
    <div class="wait" :class="[{ overtop: overtop, transparent: transparent }, color]">
        <Blur v-if="blur"/>
        <div class="logo"></div>
    </div>
</template>

<script>
import Blur from '@/components/Blur.vue';
export default {
    name: 'wait',
    components: { Blur },
    props: {
        color: {
            default: 'pink',
        },
        overtop: {
            type: Boolean,
            default: false,
        },
        transparent: {
            type: Boolean,
            default: false,
        },
        blur: {
            type: Boolean,
            default: false,
        }
    },
};
</script>

<style lang="scss">
.wait {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 400px;

    &.transparent {
        background: rgba(0,0,0,0);
    }

    &.overtop {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2;
        background: rgb(255, 255, 255);

        &.transparent {
            background: rgba(0,0,0,0);
        }

        .logo {
            opacity: 1;
        }
    }

    $loader_boarder: 4px;

    .logo {
        position: relative;
        $size: 50px;
        height: $size;
        width: $size;
        border-radius: 50%;;
        background: linear-gradient(90deg, #780096, #ff0082);
        opacity: .7;

        &:after {
            $grow: -30px;
            content: "";
            position: absolute;
            top: $grow;
            right: $grow;
            bottom: $grow;
            left: $grow;
            border-radius: 50%;

            border: 3px solid transparent;
            animation: spin 1s linear infinite;
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
            border-left-color: #780096;
        }
        50% {
            border-left-color: #ff0082;
        }
        100% {
            transform: rotate(360deg);
            border-left-color: #780096;
        }
    }
}
</style>
