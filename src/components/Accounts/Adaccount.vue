<script setup>
import { reactive, ref, watch } from "vue";
import Badge from "@/components/ui/Badge.vue";
import Ad from "./Ad.vue";
import CopyWrapper from "@/components/ui/CopyWrapper.vue";

const props = defineProps({
    adaccount: Object,
    expanded_accounts: Object,
});
const show = ref(props.expanded_accounts[props.adaccount.id] ?? false);
watch(show, (value) => {
    var expanded_accounts = window.localStorage.getItem("expanded_accounts");
    expanded_accounts = expanded_accounts ? JSON.parse(expanded_accounts) : {};
    expanded_accounts[props.adaccount.id] = value;
    window.localStorage.setItem("expanded_accounts", JSON.stringify(expanded_accounts));
});

function open_adsmanager() {
    chrome.tabs.create({
        url: `https://www.facebook.com/adsmanager/manage/campaigns?act=${props.adaccount.account_id}`,
        active: false,
    });
}
</script>
<template>
    <div
        class="shadow-adaccount transition-[margin] duration-[0.35s] ease-adaccount"
        :class="[show ? 'mx-0 mt-4 mb-4 first-of-type:mt-0 show' : 'mx-5 my-0']"
    >
        <button
            class="w-full p-3 border-b border-slate-200 bg-white cursor-pointer"
            type="button"
            @click="show = !show"
        >
            <div class="flex w-full items-center gap-2">
                <div class="text-left">
                    <div class="flex items-baseline gap-1">
                        {{ adaccount.name }}

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                            class="cursor-pointer focus:outline-none"
                            @click.stop.prevent="open_adsmanager"
                            v-tooltip="'Открыть в Adsmanager'"
                        >
                            <path
                                fill="currentColor"
                                d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
                            />
                        </svg>
                    </div>
                    <CopyWrapper
                        :value="adaccount.account_id"
                        message="ID скопирован"
                        class="text-[10px] text-slate-500 cursor-copy"
                    >
                        ID:{{ adaccount.account_id }}
                    </CopyWrapper>
                </div>
                <small class="text-[10px] leading-normal text-left">
                    Лимит:
                    {{
                        adaccount.daily_limit == "-1"
                            ? "∞"
                            : Math.round(adaccount.daily_limit / adaccount.currency_ratio_to_usd)
                    }}$ | Валюта: {{ adaccount.currency }}
                    <template v-if="adaccount.country"> | Гео: {{ adaccount.country }}</template>
                    <br />
                    <template v-if="adaccount.billing">
                        Билл: {{ Math.round(adaccount.billing / adaccount.currency_ratio_to_usd) }}$
                    </template>
                    <template v-if="adaccount.card"> | {{ adaccount.card }}</template>
                </small>
                <div class="flex grow justify-end gap-1 items-center">
                    <Badge color="gray" v-if="adaccount.ads_statuses.pending_review > 0">{{
                        adaccount.ads_statuses.pending_review
                    }}</Badge>
                    <Badge color="green" v-if="adaccount.ads_statuses.active > 0">{{
                        adaccount.ads_statuses.active
                    }}</Badge>
                    <Badge color="orange" v-if="adaccount.ads_statuses.paused > 0">{{
                        adaccount.ads_statuses.paused
                    }}</Badge>
                    <Badge color="red" v-if="adaccount.ads_statuses.disapproved > 0">{{
                        adaccount.ads_statuses.disapproved
                    }}</Badge>
                    <Badge color="red" v-if="adaccount.disable_reason">{{ adaccount.disable_reason }}</Badge>
                    <Badge :color="adaccount.status == 'ACTIVE' ? 'green' : 'orange'" v-else>{{
                        adaccount.status
                    }}</Badge>
                </div>
            </div>
        </button>
        <div
            class="transition-[max-height] duration-[0.35s] ease-adaccount overflow-auto"
            :style="{ maxHeight: !show ? 0 : (adaccount.ads.length == 0 ? 1 : adaccount.ads.length) * 80 + 'px' }"
        >
            <div class="w-100 text-center py-2" v-if="adaccount.ads.length == 0">Объявления отсутствуют</div>
            <div class="flex flex-col border-l-2 border-[#26a69a]">
                <Ad v-for="ad of adaccount.ads" :key="ad.id" :ad="ad" :show="show" />
            </div>
        </div>
    </div>
</template>
