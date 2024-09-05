<script setup lang="ts">
import { computed } from "vue";

export type TButtonColor = "red" | "teal" | "white";

export interface IBaseButtonProps {
    label: string;
    color: TButtonColor;
    disabled?: boolean;
}

const props = defineProps<IBaseButtonProps>();

const colorClasses = computed<string>(() => {
    switch (props.color) {
        case "red":
            return "text-white bg-red enabled:hover:bg-red-dark";
        case "teal":
            return "text-white bg-teal enabled:hover:bg-teal-dark";
        default:
            return "text-slate-800 enabled:hover:text-slate-500";
    }
});
</script>
<template>
    <button
        type="button"
        class="cursor-pointer rounded-sm px-3 py-[6px] text-[13px] tracking-wider shadow-nav disabled:cursor-not-allowed disabled:opacity-75"
        :class="colorClasses"
        :disabled="disabled"
    >
        {{ label }}
    </button>
</template>
