<script setup lang="ts">
import { computed } from "vue";

export type TBadgeColor = "green" | "gray" | "red" | "orange";

const props = defineProps<{
    label: string | number;
    color: TBadgeColor;
    small?: boolean;
}>();

const colorClasses = computed(() => {
    switch (props.color) {
        case "green":
            return "text-white bg-green";
        case "red":
            return "text-white bg-red";
        case "orange":
            return "text-white bg-orange";
        default:
            return "text-white bg-slate-500/[0.75]";
    }
});

const sizeClasses = computed<string>(() => (props.small ? "text-[10px]" : "text-[11px]"));
</script>
<template>
    <div class="rounded-xs px-1" :class="[colorClasses, sizeClasses]">
        {{ label }}
    </div>
</template>
