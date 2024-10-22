<script setup lang="ts">
import Adaccount from "@/pages/Accounts/Partials/Adaccount.vue";
import BaseButton from "@/components/Base/Buttons/BaseButton.vue";
import BaseLoading from "@/components/Base/BaseLoading.vue";
import BaseSelect from "@/components/Base/Inputs/BaseSelect.vue";
import ModuleAccessToken from "@/pages/Accounts/Partials/ModuleAccessToken.vue";
import { FBStore } from "@/classes/FB/FBStore";
import { openTab } from "@/classes/chromeMethods";
import { ref, watch } from "vue";

const fbStore: FBStore = FBStore.self;

const expandedAccounts = ref<string[]>(
    (() => {
        let localValue = localStorage.getItem("expanded_adaccounts");
        return localValue ? JSON.parse(localValue) : [];
    })()
);

watch(
    () => expandedAccounts.value,
    (value) => localStorage.setItem("expanded_adaccounts", JSON.stringify(value))
);

function openAdsmanager() {
    openTab("https://facebook.com/adsmanager/manage/campaings");
}
</script>
<template>
    <div v-if="!fbStore.loadAccessTokenProcessing.value && !fbStore.accessToken.value" class="mt-8 text-center">
        Произошла ошибка, попробуйте обновить страницу.<br /><br />
        <BaseButton label="Открыть Adsmanager" color="teal" @click="openAdsmanager" />
    </div>
    <div v-if="fbStore.accessToken.value" class="mt-4 flex items-end gap-4 px-8">
        <ModuleAccessToken class="grow" />
        <BaseSelect
            :options="{ name: 'Название', status: 'Статус' }"
            label="Сортировка"
            class="w-24 shrink-0"
            :model-value="fbStore.sortType.value"
            @update:model-value="(value) => fbStore.setSortType(value)"
        />
    </div>
    <div v-if="fbStore.adaccounts.value" class="px-3 py-4">
        <Adaccount
            v-for="adaccount of fbStore.adaccounts.value"
            :key="adaccount.id"
            v-model:expanded-adaccounts="expandedAccounts"
            :adaccount="adaccount"
        />
    </div>
    <BaseLoading
        v-if="fbStore.loadAccessTokenProcessing.value || fbStore.loadAdaccountsProcessing.value"
        class="pt-5"
    />
</template>
