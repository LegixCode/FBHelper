<script setup>
import useClipboard from "vue-clipboard3";
import { ref } from "vue";

const { toClipboard } = useClipboard();

const props = defineProps({
    value: String,
    message: String,
});

const copy_success = ref(false);
const copy = async () => {
    try {
        await toClipboard(props.value);
        copy_success.value = true;
        setTimeout(() => {
            copy_success.value = false;
        }, 2000);
    } catch (e) {
        console.error(e);
    }
};
</script>
<template>
    <div
        @click.stop.prevent="copy"
        v-tooltip="{
            content: message,
            shown: copy_success,
            triggers: [],
        }"
    >
        <slot />
    </div>
</template>
