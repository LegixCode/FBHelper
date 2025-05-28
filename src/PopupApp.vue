<script setup lang="ts">
import PopupLayout from "@/layouts/PopupLayout.vue";
import PageAccounts from "@/pages/Accounts/PageAccounts.vue";
import PageActions from "@/pages/Actions/PageActions.vue";
import PageCookie from "@/pages/Cookie/PageCookie.vue";
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
    <PopupLayout v-model:page="page">
        <component :is="pageComponent" />
    </PopupLayout>
</template>
