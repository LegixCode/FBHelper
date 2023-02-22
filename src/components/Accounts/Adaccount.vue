<script setup>
import { ref, watch } from "vue";
import Badge from "@/components/ui/Badge.vue";
import Ad from "./Ad.vue";
import CopyWrapper from "@/components/ui/CopyWrapper.vue";
import LinkIcon from "@/components/ui/LinkIcon.vue";

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

function open_link(link) {
    chrome.tabs.create({ url: link, active: false });
}
function open_adsmanager() {
    open_link(`https://www.facebook.com/adsmanager/manage/campaigns?act=${props.adaccount.account_id}`);
}
function open_adaccount_settins() {
    open_link(
        `https://www.facebook.com/ads/manager/account_settings/account_billing/?act=${props.adaccount.account_id}&pid=p1&page=account_settings&tab=account_billing_settings`
    );
}
function open_activate_adaccount_page() {
    open_link(`https://secure.facebook.com/ads/manage/unsettled.php?act=${props.adaccount.account_id}`);
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
                    <div class="">
                        {{ adaccount.name }}
                        <LinkIcon
                            class="mb-[3px]"
                            @click.stop.prevent="open_adsmanager"
                            v-tooltip="'Открыть в Adsmanager'"
                        />
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
                    <LinkIcon
                        class="mb-[3px] ml-[3px]"
                        @click.stop.prevent="open_adaccount_settins"
                        v-tooltip="'Открыть в настройки РК'"
                    />
                    <br />
                    <template v-if="adaccount.billing">
                        Билл: {{ Math.round(adaccount.billing / adaccount.currency_ratio_to_usd) }}$
                    </template>
                    <template v-if="adaccount.card"> | {{ adaccount.card }}</template>
                    <span
                        class="px-0.5 cursor-help"
                        v-if="adaccount.resolve_preauth_friction !== undefined"
                        v-tooltip="adaccount.resolve_preauth_friction ? 'Предавторизация' : 'Без предавторизации'"
                    >
                        <div
                            class="h-[6px] w-[6px] rounded-full inline-block"
                            :class="adaccount.resolve_preauth_friction ? 'bg-red' : 'bg-green'"
                        ></div>
                    </span>
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
                    <LinkIcon
                        v-if="adaccount.status == 'PENDING_CLOSURE'"
                        class="mb-[3px]"
                        @click.stop.prevent="open_activate_adaccount_page"
                        v-tooltip.left="'Открыть страницу воостановления аккаунта'"
                    />
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
