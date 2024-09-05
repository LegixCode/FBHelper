<script setup lang="ts">
import MainNavItem from "@/components/Layout/MainNavItem.vue";
import { TPageType } from "@/App.vue";
import { computed } from "vue";
import { FBStore } from "@/classes/FB/FBStore";

const adaccounts = FBStore.self.adaccounts;

const page = defineModel<TPageType>("page", { required: true });

let navItems = computed<{ page: TPageType; label: string; disabled?: boolean }[]>(() => [
    {
        page: "accounts",
        label: "Аккаунты",
    },
    {
        page: "actions",
        label: "Действия",
        disabled: !adaccounts.value?.length,
    },
    {
        page: "proxy",
        label: "Proxy & UA",
    },
    {
        page: "cookies",
        label: "Cookie",
    },
]);
</script>

<template>
    <div class="grid grow grid-cols-4">
        <MainNavItem
            v-for="item of navItems"
            :key="item.page"
            :label="item.label"
            :is-active="page == item.page"
            :disabled="item.disabled"
            @click="page = item.page"
        />
    </div>
</template>
