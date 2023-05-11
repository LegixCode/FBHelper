<script setup>
const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
    modelValue: {},
    label: String,
    placeholder: String,
    maxLength: {
        default: 9999,
    },
    type: {
        type: String,
        default: "text",
    },
    is_invalid: {
        type: Boolean,
        default: false,
    },
});
</script>
<template>
    <div class="relative">
        <input
            :type="type"
            :placeholder="placeholder ?? ' '"
            class="w-full pt-[10px] leading-4 h-9 text-sm focus:outline-none placeholder:opacity-0 focus:placeholder:opacity-100 border-b border-slate-300 focus:border-teal focus:shadow-[0_1px_0_0_#26a69a]"
            :maxLength="maxLength"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
        />
        <label class="inline-block absolute top-0 left-0 text-sm pt-3 opacity-60 pointer-events-none origin-left">
            {{ label }}
        </label>
    </div>
</template>
