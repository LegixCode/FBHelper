<script setup lang="ts">
import IconLink from "@/components/Base/Icons/IconLink.vue";
import ClipboardContent from "@/components/Base/ClipboardContent.vue";
import { IAdaccount } from "@/classes/FB/types/IAdaccount";
import { openTab } from "@/utils/chromeMethods";

const props = defineProps<{
    adaccount: IAdaccount;
}>();

function openAdsmanager() {
    openTab(`https://www.facebook.com/adsmanager/manage/campaigns?act=${props.adaccount.id}`, false);
}
</script>

<template>
    <div class="text-left">
        <div class="">
            {{ adaccount.name }}
            <IconLink
                v-tooltip="'Открыть в Adsmanager'"
                class="mb-[3px] inline-block"
                @click.stop.prevent="openAdsmanager"
            />
        </div>
        <ClipboardContent :value="adaccount.id" message="ID скопирован" class="cursor-copy text-[10px] text-slate-500">
            ID:{{ adaccount.id }}
        </ClipboardContent>
    </div>
</template>
