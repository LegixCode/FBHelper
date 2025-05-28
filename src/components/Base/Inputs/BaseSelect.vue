<script setup lang="ts">
import IconCaret from "@/components/Base/Icons/IconCaret.vue";
import { computed, h } from "vue";

const modelValue = defineModel<string | number>({ required: true });

export interface IBaseSelectProps {
    label: string;
    options:
        | (string | number)[]
        | { label: string | number; value: string | number }[]
        | { [value: string | number]: string | number };
}

const props = defineProps<IBaseSelectProps>();

const nodes = computed(() =>
    Array.isArray(props.options)
        ? props.options.map((option) =>
              typeof option == "object"
                  ? h("option", { value: option.value }, option.label)
                  : h("option", { value: option }, option)
          )
        : Object.keys(props.options).map((value) => h("option", { value: value }, props.options[value]))
);
</script>
<template>
    <div class="relative">
        <select
            v-model="modelValue"
            class="h-8 w-full appearance-none border-b border-slate-300 pt-[10px] pr-2 text-sm leading-4 placeholder:opacity-0 focus:border-teal-500 focus:shadow-[0_1px_0_0_#26a69a] focus:outline-hidden focus:placeholder:opacity-100"
        >
            <component :is="node" v-for="node of nodes" :key="node.props.value" />
        </select>
        <IconCaret class="absolute right-1 bottom-2" />
        <label class="pointer-events-none absolute top-0 left-0 inline-block origin-left pt-3 text-sm opacity-60">
            {{ label }}
        </label>
    </div>
</template>
