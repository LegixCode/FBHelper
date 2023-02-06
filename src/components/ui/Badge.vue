<script setup>
import { computed } from 'vue';

const props = defineProps({
    color: String,
    small: Boolean
});
const background = computed(() => {
    switch (props.color) {
        case "green":
            return "text-white bg-green";
        case "gray":
            return "text-white bg-slate-500/[0.75]";
        case "red":
            return "text-white bg-red";
        case "orange":
            return "text-white bg-orange";
    }
});
</script>
<template>
    <div class="px-1 rounded-sm" :class="[background, props.small ? 'text-[10px]' : 'text-[11px]']"><slot /></div>
</template>
