<script setup lang="ts">
import BaseToggle from "@/components/Base/Inputs/BaseToggle.vue";
import { CurrencyConverterConfig } from "@/classes/CurrencyConverterConfig";
import { computed, ref } from "vue";
import { notifyStore } from "@/components/Base/Notify/NotifyStore";

const currencyConverter = ref<CurrencyConverterConfig>();
CurrencyConverterConfig.makeFromChromeStorage((config) => (currencyConverter.value = config));

const is_active = computed<boolean>({
    get: () => currencyConverter.value?.is_active,
    set: (value) => {
        currencyConverter.value.is_active = value;
        currencyConverter.value.saveToChromeStorage();
        notifyStore.info("Обновите страницу для применения изменений")
    },
});
</script>
<template>
    <div class="mt-4 px-8">
        <div class="flex items-center justify-between">
            <h6 class="text-base">Конвертировать валюту в USD</h6>
            <BaseToggle v-model="is_active" />
        </div>
    </div>
</template>
