<script setup lang="ts">
import useClipboard from "vue-clipboard3";
import { ref } from "vue";

const { toClipboard } = useClipboard();

const props = defineProps<{
    value: string | number;
    message: string;
}>();

const copySuccess = ref(false);
const copy = async () => {
    try {
        await toClipboard(String(props.value));
        copySuccess.value = true;
        setTimeout(() => {
            copySuccess.value = false;
        }, 2000);
    } catch (e) {
        console.error(e);
    }
};
</script>
<template>
    <div
        v-tooltip="{
            content: message,
            shown: copySuccess,
            triggers: [],
        }"
        @click.stop.prevent="copy"
    >
        <slot />
    </div>
</template>
