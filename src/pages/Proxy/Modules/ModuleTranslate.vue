<script setup lang="ts">
import BaseToggle from "@/components/Base/Inputs/BaseToggle.vue";
import { TranslateConfig } from "@/classes/TranslateConfig";
import { activateLocaleRule, deactivateLocaleRule } from "@/utils/chromeMethods";
import { computed, reactive } from "vue";

const translate = reactive<TranslateConfig>(TranslateConfig.makeFromLocalStorage());

const is_active = computed<boolean>({
    get: () => translate.is_active,
    set: (value) => {
        translate.is_active = value;
        translate.saveToLocalStorage();
        value ? activateLocaleRule() : deactivateLocaleRule();
    },
});
</script>
<template>
    <div class="mt-4 px-8">
        <div class="flex items-center justify-between">
            <h6 class="text-base">Переводить на русский</h6>
            <BaseToggle v-model="is_active" />
        </div>
    </div>
</template>
