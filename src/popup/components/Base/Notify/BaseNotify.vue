<script setup lang="ts">
import { notifyStore } from "./NotifyStore";
import { computed } from "vue";

const notification = computed(() => notifyStore.notification);
</script>
<template>
    <div
        v-if="notification"
        class="fixed bottom-0 w-full p-[10px] text-center text-[15px] text-white"
        :class="{
            'bg-green': notification.type === 'success',
            'bg-red': notification.type === 'error',
        }"
    >
        {{ notification.title }}
    </div>
</template>
