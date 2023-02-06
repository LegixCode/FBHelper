<script setup>
import { computed, inject, onMounted, ref } from "vue";

const emitter = inject("emitter");
const notification = ref(null);

var timer = 0;

onMounted(() => {
    emitter.on("notify", (n) => {
        if (timer != 0) clearTimeout(timer);
        notification.value = n;
        timer = setTimeout(() => {
            notification.value = null;
            timer = 0;
        }, 3000);
    });
});

const color = computed(() => {
    if (!notification.value) return "";
    return notification.value.type == "success" ? "bg-green" : "bg-red";
});
</script>
<template>
    <div class="fixed w-full bottom-0 p-[10px] text-center text-white text-[15px]" :class="[color]" v-if="notification">
        {{ notification.title }}
    </div>
</template>
