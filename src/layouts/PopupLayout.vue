<script setup lang="ts">
import BaseNotify from "@/components/Base/Notify/BaseNotify.vue";
import MainNav from "@/components/PopupLayout/MainNav.vue";
import UsefulLinksMenu from "@/components/PopupLayout/UsefulLinksMenu.vue";
import { TPageType } from "@/PopupApp.vue";

const page = defineModel<TPageType>("page", { required: true });
</script>

<template>
    <div class="shadow-nav fixed inset-x-0 top-0 z-10 flex h-12">
        <MainNav v-model:page="page" />
        <UsefulLinksMenu />
    </div>
    <div class="mt-12 h-[512px] overflow-y-auto bg-white">
        <slot />
    </div>
    <BaseNotify />
</template>
