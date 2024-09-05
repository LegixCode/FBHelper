<script setup lang="ts">
import BaseToggle from "@/components/Base/Inputs/BaseToggle.vue";
import { computed, reactive } from "vue";
import { TranslateConfig } from "@/classes/TranslateConfig";

const translate = reactive(TranslateConfig.makeFromLocalStorage());

const is_active = computed<boolean>({
    get: () => translate.is_active,
    set: (value) => {
        translate.is_active = value;
        translate.saveToLocalStorage();
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
