<script setup lang="ts">
import MainLayout from "@/components/Layout/MainLayout.vue";
import PageAccounts from "@/pages/Accounts/PageAccounts.vue";
import PageActions from "@/pages/Actions/PageActions.vue";
import PageCookie from "@/pages/PageCookie.vue";
import PageProxy from "@/pages/Proxy/PageProxy.vue";
import { computed, ref } from "vue";

export type TPageType = "accounts" | "actions" | "proxy" | "cookies";

const page = ref<TPageType>("accounts");

const pageComponent = computed(() => {
    switch (page.value) {
        case "accounts":
            return PageAccounts;
        case "actions":
            return PageActions;
        case "proxy":
            return PageProxy;
        case "cookies":
            return PageCookie;
    }
});
</script>

<template>
    <MainLayout v-model:page="page">
        <component :is="pageComponent" />
    </MainLayout>
</template>
