<script setup>
import Badge from "@/components/ui/Badge.vue";

defineProps({
    ad: Object,
    show: Boolean,
});
</script>
<template>
    <div
        class="flex items-center border-b border-slate-100 py-2 gap-4 text-xs ad bg-white transition-all"
    >
        <img :src="ad.preview" class="rounded-full h-10" />
        <div class="shrink-0 max-w-[200px]">{{ ad.name }}</div>
        <div class="flex grow justify-end gap-1 items-center flex-wrap">
            <Badge
                :small="true"
                :color="
                    ad.effective_status == 'ACTIVE'
                        ? 'green'
                        : ad.effective_status == 'PENDING_REVIEW'
                        ? 'gray'
                        : ['PAUSED', 'CAMPAIGN_PAUSED', 'ADSET_PAUSED'].indexOf(ad.effective_status) != -1
                        ? 'orange'
                        : 'red'
                "
                v-if="!(ad.effective_status == 'DISAPPROVED' && ad.ad_review_feedback.length > 0)"
            >
                {{ ad.effective_status }}
            </Badge>
            <Badge color="red" :small="true" v-for="feedback of ad.ad_review_feedback" :key="feedback">{{ feedback }}</Badge>
        </div>
    </div>
</template>
