<script setup lang="ts">
import Country from "./Modules/ModuleCountry.vue";
import Pixel from "./Modules/ModulePixel.vue";
import Card from "./Modules/ModuleCard.vue";
import Rules from "./Modules/ModuleRules.vue";
import { computed, ref } from "vue";
import BaseSelect from "@/components/Base/Inputs/BaseSelect.vue";
import { FBStore } from "@/classes/FB/FBStore";

const adaccounts = FBStore.self.adaccounts;

const selectedAdaccountId = ref(adaccounts.value[0].id);
const selectedAdaccount = computed(() => {
    return adaccounts.value.find((adaccount) => adaccount.id == selectedAdaccountId.value);
});

const selectAdaccountOptions = computed(() =>
    adaccounts.value.map((adaccount) => {
        let labelData = [adaccount.name, adaccount.status];
        if (adaccount.cards) labelData.splice(1, 0, adaccount.cards);
        return {
            label: labelData.join(" | "),
            value: adaccount.id,
        };
    })
);
</script>
<template>
    <div class="mt-4 px-8">
        <h6 class="text-base">Рекламные аккаунты</h6>
        <BaseSelect
            v-model="selectedAdaccountId"
            label="Рекламмный аккаунт"
            class="mt-4"
            :options="selectAdaccountOptions"
        />
        <div class="mt-6 grid grid-cols-2 items-center">
            <div class="pr-3">
                <Country :adaccount-id="selectedAdaccountId" />
                <template v-if="!selectedAdaccount.has_pixel">
                    <hr class="my-3 text-slate-300" />
                    <Pixel :adaccount-id="selectedAdaccountId" />
                </template>
            </div>
            <div class="border-l border-slate-300 pl-3">
                <Card :adaccount-id="selectedAdaccountId" />
                <hr class="my-3 text-slate-300" />
                <Rules :adaccount-id="selectedAdaccountId" />
            </div>
        </div>
    </div>
</template>
