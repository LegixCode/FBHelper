<script setup lang="ts">
import BaseBadge from "@/components/Base/BaseBadge.vue";
import ClipboardContent from "@/components/Base/ClipboardContent.vue";
import { IAd } from "@/classes/FB/types/IAd";
import { computed } from "vue";

const props = defineProps<{
    ad: IAd;
}>();

const badgeEffectiveStatusColor = computed(() =>
    props.ad.effective_status === "ACTIVE"
        ? "green"
        : props.ad.effective_status === "PENDING_REVIEW"
          ? "gray"
          : ["PAUSED", "CAMPAIGN_PAUSED", "ADSET_PAUSED"].includes(props.ad.effective_status)
            ? "orange"
            : "red"
);
</script>
<template>
    <div class="ad flex items-center gap-4 border-b border-slate-100 bg-white py-2 text-xs transition-all">
        <img :src="ad.preview" class="h-10 rounded-full" alt="ad.name" />
        <div class="max-w-[200px] shrink-0">
            <div>{{ ad.name }}</div>
            <ClipboardContent :value="ad.id" message="ID скопирован" class="cursor-copy text-[10px] text-slate-500">
                ID:{{ ad.id }}
            </ClipboardContent>
        </div>
        <div class="flex grow flex-wrap items-center justify-end gap-1">
            <BaseBadge
                v-if="!(ad.effective_status === 'DISAPPROVED' && Object.keys(ad.ad_review_feedback).length > 0)"
                :label="ad.effective_status"
                :color="badgeEffectiveStatusColor"
                small
            />
            <BaseBadge v-for="(description, name) of ad.ad_review_feedback" :key="name" v-tooltip="description" :label="name" color="red" small />
        </div>
    </div>
</template>
