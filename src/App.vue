<script setup>
import { onMounted, reactive, ref } from "vue";
import submenu from "@/components/submenu.vue";
import MenuButton from "@/components/ui/MenuButton.vue";
import Accounts from "@/pages/Accounts.vue";
import Cookie from "@/pages/Cookie.vue";
import Proxy from "@/pages/Proxy.vue";
import Actions from "@/pages/Actions.vue";
import Notify from "./components/notify.vue";

const page = ref("accounts");

var fb_data = reactive({
    is_loading: true,
    access_token: false,
    adaccounts: false,
});
chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "get_token" }, (access_token) => {
        if (!access_token) {
            fb_data.is_loading = false;
        } else {
            fb_data.access_token = access_token;

            chrome.tabs.sendMessage(
                tabs[0].id,
                { action: "get_adaccounts", access_token: access_token },
                (adaccounts) => {
                    console.log(adaccounts);
                    fb_data.adaccounts = adaccounts;
                    fb_data.is_loading = false;
                }
            );
        }
    });
});
</script>

<template>
    <div class="flex h-12 shadow-nav fixed top-0 inset-x-0 z-10">
        <div class="grid grow grid-cols-4">
            <MenuButton :is_active="page == 'accounts'" @click="page = 'accounts'">АККАУНТЫ</MenuButton>
            <MenuButton :is_active="page == 'actions'" @click="page = 'actions'" :disabled="!fb_data.adaccounts">
                ДЕЙСТВИЯ
            </MenuButton>
            <MenuButton :is_active="page == 'proxy'" @click="page = 'proxy'">PROXY & UA</MenuButton>
            <MenuButton :is_active="page == 'cookie'" @click="page = 'cookie'">COOKIE</MenuButton>
        </div>
        <submenu />
    </div>
    <div class="h-[512px] overflow-y-auto bg-white mt-12">
        <Accounts :fb_data="fb_data" v-if="page == 'accounts'" />
        <Actions :fb_data="fb_data" v-if="page == 'actions'" />
        <Proxy v-if="page == 'proxy'" />
        <Cookie v-if="page == 'cookie'" />
    </div>
    <Notify />
</template>
