<script setup lang="ts">
import IconLink from "@/components/Base/Icons/IconLink.vue";
import { IAdaccount } from "@/classes/FB/types/IAdaccount";
import { openTab } from "@/classes/chromeMethods";
import { computed } from "vue";

const props = defineProps<{
    adaccount: IAdaccount;
}>();

const firstRowData = computed(() => {
    let limit =
        props.adaccount.daily_limit.toString() == "-1"
            ? "∞"
            : Math.round(props.adaccount.daily_limit / props.adaccount.currency_ratio_to_usd);
    let row = [`Лимит: ${limit}$`, `Валюта: ${props.adaccount.currency}`];
    if (props.adaccount.country) row.push(`Гео: ${props.adaccount.country}`);
    if (props.adaccount.timezone) row.push(`Ч/п: ${props.adaccount.timezone}`);
    return row.join(" | ");
});

const secondRowData = computed(() => {
    let row = [];
    if (props.adaccount.amount_spent)
        row.push(`Потрачено: ${Math.round(props.adaccount.amount_spent / 100 / props.adaccount.currency_ratio_to_usd)}$`);
    if (props.adaccount.billing)
        row.push(`Билл: ${Math.round(props.adaccount.billing / props.adaccount.currency_ratio_to_usd)}$`);
    if (props.adaccount.cards) row.push(props.adaccount.cards);
    return row.join(" | ");
});

function openAdaccountSettings() {
    openTab(
        `https://www.facebook.com/ads/manager/account_settings/account_billing/?act=${props.adaccount.id}&pid=p1&page=account_settings&tab=account_billing_settings`,
        false
    );
}
</script>

<template>
    <small class="text-left text-[10px] leading-normal">
        {{ firstRowData }}
        <IconLink
            v-tooltip="'Открыть настройки РК'"
            class="mb-[3px] ml-[3px] inline-block"
            @click.stop.prevent="openAdaccountSettings"
        />
        <br />
        {{ secondRowData }}
        <span
            v-if="adaccount.resolve_preauth_friction !== undefined"
            v-tooltip="adaccount.resolve_preauth_friction ? 'Предавторизация' : 'Без предавторизации'"
            class="cursor-help px-0.5"
        >
            <span
                class="inline-block h-[6px] w-[6px] rounded-full"
                :class="adaccount.resolve_preauth_friction ? 'bg-red' : 'bg-green'"
            ></span>
        </span>
    </small>
</template>

<style scoped></style>
