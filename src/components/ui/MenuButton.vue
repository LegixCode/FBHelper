<script setup>
const props = defineProps({
    is_active: Boolean,
});
</script>
<template>
    <button
        class="text-center disabled:cursor-not-allowed border-b-2 pt-[2px] transition-colors text-sm"
        :class="[is_active ? 'border-black' : 'border-white text-slate-800/[0.8] enabled:hover:text-slate-800']"
    >
        <slot />
    </button>
</template>
