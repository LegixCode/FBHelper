<script setup lang="ts">
const modelValue = defineModel<string | number>({ required: true });

export interface IBaseInputProps {
    label: string;
    placeholder?: string;
    maxLength?: number;
    type?: string;
    isInvalid?: boolean;
    disabled?: boolean;
}

withDefaults(defineProps<IBaseInputProps>(), {
    placeholder: " ",
    maxLength: 9999,
    type: "text",
    isInvalid: false,
});
</script>
<template>
    <div class="relative">
        <input
            v-model="modelValue"
            :type="type"
            :placeholder="placeholder ?? ' '"
            class="h-9 w-full border-b border-slate-300 bg-white pt-[10px] text-sm leading-4 placeholder:opacity-0 focus:border-teal focus:shadow-[0_1px_0_0_#26a69a] focus:outline-none focus:placeholder:opacity-100"
            :maxLength="maxLength"
            :disabled="disabled"
        />
        <label class="pointer-events-none absolute left-0 top-0 inline-block origin-left pt-3 text-sm opacity-60">
            {{ label }}
        </label>
    </div>
</template>
