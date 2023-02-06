<script setup>
const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
    modelValue: {},
    label: String,
});
</script>
<template>
    <div class="relative">
        <select
            placeholder=" "
            class="w-full pt-[10px] leading-4 h-8 text-sm appearance-none focus:outline-none placeholder:opacity-0 focus:placeholder:opacity-100 border-b border-slate-300 focus:border-teal-500 focus:shadow-[0_1px_0_0_#26a69a] pr-2"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
        >
            <slot />
        </select>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 1024 1024"
            class="absolute right-1 bottom-2"
        >
            <path
                fill="currentColor"
                d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"
            />
        </svg>
        <label class="inline-block absolute top-0 left-0 pt-3 text-sm opacity-60 pointer-events-none origin-left">
            {{ label }}
        </label>
    </div>
</template>
