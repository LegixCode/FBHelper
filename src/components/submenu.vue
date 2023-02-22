<script setup>
import { ref } from "vue";

const is_show = ref(false);
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
function open(url) {
    chrome.tabs.create({
        url: url,
    });
}
</script>
<template>
    <button type="button" class="bg-teal px-3 rounded-bl text-white hover:bg-teal-dark" @click="is_show = true">
        ▼
    </button>
    <div class="fixed inset-0" v-if="is_show" @click="is_show = false">
        <div class="absolute top-0 right-0 bg-white shadow-nav">
            <ul>
                <li
                    v-for="link of links"
                    :key="link.url"
                    class="cursor-pointer hover:bg-slate-100 py-2 px-3 border-b border-slate-100"
                    @click="open(link.url)"
                >
                    {{ link.name }}
                </li>
                <li
                    class="flex items-center justify-between py-2 px-3 hover:bg-slate-100 cursor-pointer"
                    @click="open('https://t.me/legix_cpa')"
                >
                    v1.23.0
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 32 32"
                        class="text-teal text-xl"
                    >
                        <path
                            fill="currentColor"
                            d="M16 .5C7.437.5.5 7.438.5 16S7.438 31.5 16 31.5c8.563 0 15.5-6.938 15.5-15.5S24.562.5 16 .5zm7.613 10.619l-2.544 11.988c-.188.85-.694 1.056-1.4.656l-3.875-2.856l-1.869 1.8c-.206.206-.381.381-.781.381l.275-3.944l7.181-6.488c.313-.275-.069-.431-.482-.156l-8.875 5.587l-3.825-1.194c-.831-.262-.85-.831.175-1.231l14.944-5.763c.694-.25 1.3.169 1.075 1.219z"
                        />
                    </svg>
                </li>
            </ul>
        </div>
    </div>
</template>
