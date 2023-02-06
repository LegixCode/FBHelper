<script setup>
const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
    modelValue: {},
    label: String,
    placeholder: String,
    lines: {
        type: Number,
        default: 2,
    },
});
</script>
<template>
    <div class="relative">
        <textarea
            :placeholder="placeholder ?? ' '"
            class="w-full leading-4 focus:outline-none placeholder:opacity-0 focus:placeholder:opacity-100 border-b border-slate-300 focus:border-teal-500 focus:shadow-[0_1px_0_0_#26a69a] mt-4"
            :style="{ height: lines * 16 + 1 }"
            :maxLength="maxLength"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
        ></textarea>
        <label class="inline-block absolute top-0 left-0 pt-[14px] opacity-60 pointer-events-none origin-left">
            {{ label }}
        </label>
    </div>
</template>
