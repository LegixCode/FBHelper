<script setup>
import { computed } from "@vue/reactivity";

const props = defineProps({
    color: String,
    bg: {
        type: Boolean,
        default: false,
    },
    disabled: Boolean,
});

const background = computed(() => {
    switch (props.color) {
        case "red":
            return "text-white bg-red enabled:hover:bg-red-dark";
        case "teal":
            return "text-white bg-teal enabled:hover:bg-teal-dark";
    }
});
const text = computed(() => {
    switch (props.color) {
        case "gray":
            return "text-slate-800 enabled:hover:text-slate-500";
    }
});
</script>
<template>
    <button
        type="button"
        class="px-3 py-[6px] text-[13px] rounded-sm cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed shadow-nav tracking-wider"
        :class="[bg ? background : text]"
        :disabled="disabled"
    >
        <slot />
    </button>
</template>
