<script setup lang="ts">
const modelValue = defineModel<string>({ required: true });

export interface IBaseTextareaProps {
    label: string;
    placeholder: string;
    lines: number;
}

withDefaults(defineProps<IBaseTextareaProps>(), {
    placeholder: " ",
    lines: 2,
});
</script>
<template>
    <div class="relative">
        <textarea
            v-model="modelValue"
            :placeholder="placeholder ?? ' '"
            class="focus:border-teal-500 mt-4 w-full border-b border-slate-300 leading-4 placeholder:opacity-0 focus:shadow-[0_1px_0_0_#26a69a] focus:outline-none focus:placeholder:opacity-100"
            :style="{ height: lines * 16 + 1 }"
        ></textarea>
        <label class="pointer-events-none absolute left-0 top-0 inline-block origin-left pt-[14px] opacity-60">
            {{ label }}
        </label>
    </div>
</template>
