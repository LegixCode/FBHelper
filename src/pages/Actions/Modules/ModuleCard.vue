<script setup lang="ts">
import BaseButton from "@/components/Base/Buttons/BaseButton.vue";
import BaseInput from "@/components/Base/Inputs/BaseInput.vue";
import { CardConfig } from "@/classes/FB/types/CardConfig";
import { computed, reactive, watch } from "vue";
import { FBStore } from "@/classes/FB/FBStore";
import { notifyStore } from "@/components/Base/Notify/NotifyStore";

const accessToken = FBStore.self.accessToken,
    userId = FBStore.self.userId;

const props = defineProps<{
    adaccountId: number;
}>();

const card = reactive(CardConfig.makeFromLocalStorage());

watch(
    () => card,
    () => card.saveToLocalStorage(),
    { deep: true }
);

const number = computed({
    get: () => card.number,
    set(value) {
        let valueArr = value.trim().split(" ");
        if (valueArr.length == 1) valueArr = value.split("	");
        if (valueArr.length != 4) {
            card.number = value;
        } else {
            card.number = valueArr[0];
            card.expiry_month = valueArr[1];
            card.expiry_year = valueArr[2];
            card.cvc = valueArr[3];
        }
    },
});

function apply() {
    let xhr = new XMLHttpRequest();

    const params = new URLSearchParams({
        make_ads_primaty_funding_source: "1",
        app_version: "22916291",
        payment_type: "ads_invoice",
        locale: "uk_UA",
        billing_address: '{"country_code":"US","zip":672934}',
        sdk: "ios",
        sdk_version: "3",
        risk_features: '{"CreditCardFormType":"mobile","MobilePlatform":"iOS"}',
        pretty: "0",
        format: "json",
        fb_api_req_friendly_name: "add_credit_card",
        fb_api_caller_class: "com.facebook.payments.common.PaymentNetworkOperationHelper",
        creditCardNumber: card.number,
        expiry_year: card.expiry_year,
        expiry_month: card.expiry_month,
        csc: card.cvc,
        account_id: props.adaccountId.toString(),
    });

    xhr.open(
        "POST",
        `https://graph.secure.facebook.com/ajax/payment/token_proxy.php?tpe=/${userId.value}/creditcards`,
        true
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-Fb-Connection-Type", "wifi");
    xhr.setRequestHeader("X-Fb-Sim-Hni", "25001");
    xhr.setRequestHeader("Authorization", "OAuth " + accessToken.value);

    xhr.onload = function () {
        let response = JSON.parse(xhr.response);
        if (response.id && response.card_type) notifyStore.success("Карта успешно привязана 🔥🔥🔥");
        else notifyStore.error("При привязке возникла ошибка");
    };

    xhr.send(params.toString());
}
</script>
<template>
    <div class="grid grid-cols-3 gap-3">
        <BaseInput v-model="number" label="Номер карты" class="col-span-3" />
        <BaseInput v-model="card.expiry_month" label="Месяц" placeholder="10" maxlength="2" />
        <BaseInput v-model="card.expiry_year" label="Год" placeholder="2021" maxlength="4" />
        <BaseInput v-model="card.cvc" label="CVC" placeholder="000" maxlength="3" />
        <BaseButton label="Привязать" color="red" class="col-span-3" @click="apply" />
    </div>
</template>
