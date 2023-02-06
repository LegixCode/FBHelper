<script setup>
import Adaccount from "@/components/Accounts/Adaccount.vue";
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
import Loading from "@/components/ui/Loading.vue";
import { ref } from "vue";
import CopyWrapper from "@/components/ui/CopyWrapper.vue";

const props = defineProps({
    fb_data: Object,
});

var expanded_accounts = window.localStorage.getItem("expanded_accounts");
expanded_accounts = expanded_accounts ? JSON.parse(expanded_accounts) : {};

function openAdsmanager() {
    chrome.tabs.create({
        url: "https://facebook.com/adsmanager/manage/campaings",
    });
}
</script>
<template>
    <div class="text-center mt-8" v-if="!fb_data.is_loading && !fb_data.access_token">
        Произошла ошибка, попробуйте обновить страницу.<br /><br />
        <Button color="teal" :bg="true" @click="openAdsmanager"> Открыть Adsmanager </Button>
    </div>
    <div class="flex items-end mt-4 px-8" v-if="fb_data.access_token">
        <Input class="grow mr-3" label="Токен" placeholder="EAA..." :modelValue="fb_data.access_token" />
        <CopyWrapper :value="fb_data.access_token" message="Токен скопирован">
            <Button color="teal" :bg="true"> СКОПИРОВАТЬ </Button>
        </CopyWrapper>
    </div>
    <div class="px-3 py-4" v-if="fb_data.adaccounts">
        <Adaccount
            v-for="adaccount of fb_data.adaccounts"
            :key="adaccount.id"
            :adaccount="adaccount"
            :expanded_accounts="expanded_accounts"
        />
    </div>
    <Loading class="pt-5" v-if="fb_data.is_loading" />
</template>
