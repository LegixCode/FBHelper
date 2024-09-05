<script setup lang="ts">
defineProps<{
    isActive: boolean;
    disabled?: boolean;
    label: string;
}>();
</script>
<template>
    <button
        class="border-b-2 pt-[2px] text-center text-sm uppercase transition-colors disabled:cursor-not-allowed"
        :class="[isActive ? 'border-black' : 'border-white text-slate-800/[0.8] enabled:hover:text-slate-800']"
        :disabled="disabled"
    >
        {{ label}}
    </button>
</template>
