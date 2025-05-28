<script setup lang="ts">
import { Component } from "vue";

defineProps<{
    icon: Component;
}>();
</script>

<template>
    <button type="button" class="rounded-full bg-red p-2 text-white hover:bg-red-dark">
        <component :is="icon" />
    </button>
</template>
