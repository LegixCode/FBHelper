<script setup lang="ts">
import IconLink from "@/components/Base/Icons/IconLink.vue";
import BaseBadge, { TBadgeColor } from "@/components/Base/BaseBadge.vue";
import { IAdaccount } from "@/classes/FB/types/IAdaccount";
import { openTab } from "@/utils/chromeMethods";
import { computed } from "vue";

const props = defineProps<{
    adaccount: IAdaccount;
}>();

const adsBadges = computed(() => {
    let badges: { color: TBadgeColor; count: number }[] = [
        {
            color: "gray",
            count: props.adaccount.ads.filter((ad) => ["PENDING_REVIEW"].includes(ad.effective_status)).length,
        },
        {
            color: "green",
            count: props.adaccount.ads.filter((ad) => ["ACTIVE"].includes(ad.effective_status)).length,
        },
        {
            color: "orange",
            count: props.adaccount.ads.filter((ad) =>
                ["PAUSED", "CAMPAIGN_PAUSED", "ADSET_PAUSED"].includes(ad.effective_status)
            ).length,
        },
    ];
    badges.push({
        color: "red",
        count: props.adaccount.ads.length - badges[0].count - badges[1].count - badges[2].count,
    });
    return badges.filter((b) => b.count);
});

function openActivateAdaccountPage() {
    openTab(`https://secure.facebook.com/ads/manage/unsettled.php?act=${props.adaccount.id}`, false);
}
</script>

<template>
    <div class="flex grow items-center justify-end gap-1">
        <BaseBadge v-for="adBadge of adsBadges" :key="adBadge.color" :color="adBadge.color" :label="adBadge.count" />
        <BaseBadge v-if="adaccount.disable_reason" color="red" :label="adaccount.disable_reason" />
        <BaseBadge v-else :color="adaccount.status === 'ACTIVE' ? 'green' : 'orange'" :label="adaccount.status" />
        <IconLink
            v-if="adaccount.status === 'PENDING_CLOSURE'"
            v-tooltip.left="'Открыть страницу воостановления аккаунта'"
            class="mb-[3px]"
            @click.stop.prevent="openActivateAdaccountPage"
        />
    </div>
</template>

<style scoped></style>
