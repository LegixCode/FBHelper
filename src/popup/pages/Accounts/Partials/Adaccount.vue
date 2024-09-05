<script setup lang="ts">
import Ad from "./Ad.vue";
import AdaccountBadges from "@/pages/Accounts/Partials/AdaccountBadges.vue";
import AdaccountInfo from "@/pages/Accounts/Partials/AdaccountInfo.vue";
import AdaccountName from "@/pages/Accounts/Partials/AdaccountName.vue";
import { IAdaccount } from "@/classes/FB/types/IAdaccount";
import { computed } from "vue";

const expandedAdaccounts = defineModel<string[]>("expandedAdaccounts");

const props = defineProps<{
    adaccount: IAdaccount;
}>();

const isExpanded = computed({
    get: () => expandedAdaccounts.value.includes(props.adaccount.id),
    set: (value) => {
        if (value) expandedAdaccounts.value = [...expandedAdaccounts.value, props.adaccount.id];
        else expandedAdaccounts.value = expandedAdaccounts.value.filter((id) => id != props.adaccount.id);
    },
});
</script>
<template>
    <div
        class="shadow-adaccount transition-[margin] duration-[0.35s] ease-adaccount"
        :class="[isExpanded ? 'show mx-0 mb-4 mt-4 first-of-type:mt-0' : 'mx-5 my-0']"
    >
        <div
            class="inline-block w-full cursor-pointer border-b border-slate-200 bg-white p-3"
            type="button"
            @click="isExpanded = !isExpanded"
        >
            <div class="flex w-full items-center gap-2">
                <AdaccountName :adaccount="adaccount" />
                <AdaccountInfo :adaccount="adaccount" />
                <AdaccountBadges :adaccount="adaccount" />
            </div>
        </div>
        <div
            class="overflow-auto transition-[max-height] duration-[0.35s] ease-adaccount"
            :style="{ maxHeight: !isExpanded ? 0 : Math.max(1, adaccount.ads.length) * 80 + 'px' }"
        >
            <div v-if="adaccount.ads.length == 0" class="w-100 py-2 text-center">Объявления отсутствуют</div>
            <div v-else class="flex flex-col border-l-2 border-[#26a69a]">
                <Ad v-for="ad of adaccount.ads" :key="ad.id" :ad="ad" />
            </div>
        </div>
    </div>
</template>
