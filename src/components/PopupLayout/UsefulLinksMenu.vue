<script setup lang="ts">
import IconTelegram from "@/components/Base/Icons/IconTelegram.vue";
import { openTab, getVersion } from "@/utils/chromeMethods";
import { ref } from "vue";

const shown = ref(false);
const version = ref(getVersion());
const links = [
    {
        url: "https://facebook.com",
        name: "FB",
    },
    {
        url: "https://facebook.com/adsmanager/manage/campaings",
        name: "Ads Manager",
    },
    {
        url: "https://business.facebook.com/settings",
        name: "БМ",
    },
    {
        url: "https://www.facebook.com/accountquality",
        name: "Качество аккаунта",
    },
    {
        url: "https://docs.google.com/document/d/1q7_YbQ00uxNA86lxk55Kvercx9xBKhfQLSe-Lab2tW0/edit",
        name: "Полезные ссылки",
    },
    {
        url: "https://www.facebook.com/support",
        name: "Поддержка",
    },
    {
        url: "https://www.facebook.com/payments/risk/preauth/?ad_account_id=&entrypoint=AYMTAdAccountUnrestrictLinkGenerator",
        name: "Risk Списание",
    },
    {
        url: "https://www.facebook.com/help/contact/649167531904667",
        name: "Risk Ticket",
    },
    {
        url: "https://www.facebook.com/payments/risk/preauth/?ad_account_id=&entrypoint=WWW_AYMT_NOTIFICATION",
        name: "Policy Списание",
    },
    {
        url: "https://mbasic.facebook.com/support/forms/flow_view?id=2026068680760273",
        name: "Policy Ticket",
    },
];
</script>
<template>
    <button type="button" class="rounded-bl bg-teal px-3 text-white hover:bg-teal-dark" @click="shown = true">▼</button>
    <div v-if="shown" class="fixed inset-0" @click="shown = false">
        <div class="absolute right-0 top-0 bg-white shadow-nav">
            <ul>
                <li
                    v-for="link of links"
                    :key="link.url"
                    class="cursor-pointer border-b border-slate-100 px-3 py-2 hover:bg-slate-100"
                    @click="openTab(link.url)"
                >
                    {{ link.name }}
                </li>
                <li
                    class="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-slate-100"
                    @click="openTab('https://t.me/legix_cpa')"
                >
                    v{{ version }}
                    <IconTelegram class="text-xl text-teal" />
                </li>
            </ul>
        </div>
    </div>
</template>
