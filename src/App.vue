<script setup>
import { reactive, ref } from "vue";
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
            chrome.tabs.sendMessage(tabs[0].id, { action: "get_adaccounts", access_token: access_token }, (result) => {
                fb_data.adaccounts = result.adaccounts;
                fb_data.is_loading = false;
                if (!result.success_cards_request) loadCards();
                loadBillingHoldStatus();
            });
        }
    });
});

function loadCards() {
    fb_data.adaccounts.forEach((adaccount) => {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://graph.facebook.com/v15.0/graphql?access_token=" + fb_data.access_token, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload = () => {
            var response = JSON.parse(xhr.response);
            console.log(response);
            if (
                response.data &&
                response.data.billable_account_by_payment_account &&
                response.data.billable_account_by_payment_account.billing_payment_account &&
                response.data.billable_account_by_payment_account.billing_payment_account.billing_payment_methods
            ) {
                var cards = [];
                response.data.billable_account_by_payment_account.billing_payment_account.billing_payment_methods.forEach(
                    (payment_method) => {
                        if (payment_method.credential.last_four_digits)
                            cards.push(
                                payment_method.credential.card_association_name +
                                    " · " +
                                    payment_method.credential.last_four_digits
                            );
                        else if (payment_method.credential.email) cards.push(payment_method.credential.email);
                    }
                );
                adaccount.card = cards.join(",");
            }
        };
        xhr.send(
            `fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BillingHubPaymentSettingsPaymentMethodsListQuery&doc_id=6271422066224436&variables={"paymentAccountID":"${adaccount.account_id}","hasSDCRiskRestriction":false}`
        );
    });
}

function loadBillingHoldStatus() {
    var chunks = [[]];
    var chunk_index = 0;
    fb_data.adaccounts.forEach((adaccount) => {
        chunks[chunk_index].push(adaccount);
        if (chunks[chunk_index].length == 50) {
            chunks.push([]);
            chunk_index++;
        }
    });
    chunks.forEach((adaccounts) => {
        var requests = [];
        adaccounts.forEach((adaccount) => {
            requests.push({
                method: "POST",
                relative_url: `graphql?fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BillingWizardNameUtilsQuery&doc_id=5029176233809814&variables={"paymentAccountID":"${adaccount.account_id}","budget":null}`,
            });
        });
        var xhr = new XMLHttpRequest();
        xhr.open(
            "POST",
            "https://graph.facebook.com/v15.0/?include_headers=false&access_token=" + fb_data.access_token,
            true
        );
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onload = () => {
            var response = JSON.parse(xhr.response);
            if (response.error || !Array.isArray(response)) return;
            for (var i = 0; i < response.length; i++) {
                if (response[i].code != 200) continue;
                var body = JSON.parse(response[i].body);
                if (
                    body.data &&
                    body.data.required_wizard_name &&
                    body.data.required_wizard_name.wizard_name &&
                    body.data.required_wizard_name.wizard_name == "RESOLVE_PREAUTH_FRICTION"
                )
                    adaccounts[i].resolve_preauth_friction = true;
                else adaccounts[i].resolve_preauth_friction = false;
            }
        };

        xhr.send("batch=" + encodeURIComponent(JSON.stringify(requests)));
    });
}
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
