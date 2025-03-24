<script setup lang="ts">
import BaseToggle from "@/components/Base/Inputs/BaseToggle.vue";
import { computed, ref } from "vue";
import { DisablePopupConfig } from "@/classes/DisablePopupConfig";

const disablePopup = ref<DisablePopupConfig>();
    DisablePopupConfig.makeFromChromeStorage((config) => (disablePopup.value = config));

const is_active = computed<boolean>({
    get: () => disablePopup.value.is_active,
    set: (value) => {
        disablePopup.value.is_active = value;
        disablePopup.value.saveToChromeStorage();
    },
});
</script>
<template>
    <div class="mt-4 px-8">
        <div class="flex items-center justify-between">
            <h6 class="text-base">Удалять всплывающие окна</h6>
            <BaseToggle v-model="is_active" />
        </div>
    </div>
</template>
