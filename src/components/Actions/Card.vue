<script setup>
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
import { computed, onMounted, ref, watch, inject } from "vue";

const emitter = inject("emitter");

const props = defineProps({
    adaccount_id: Number,
    access_token: String,
});

const card = ref({
    number: "",
    expiry_month: "",
    expiry_year: "",
    cvc: "",
});

onMounted(() => {
    var card_data = localStorage.getItem("card");
    if (card_data) {
        card_data = JSON.parse(card_data);
        card.value.number = card_data.number;
        card.value.expiry_month = card_data.expiry_month;
        card.value.expiry_year = card_data.expiry_year;
        card.value.cvc = card_data.cvc;
    }
    watch(() => card.value.expiry_month, save);
    watch(() => card.value.expiry_year, save);
    watch(() => card.value.cvc, save);
});

const number = computed({
    get() {
        return card.value.number;
    },
    set(value) {
        var valueArr = value.split(" ");
        if (valueArr.length == 1) valueArr = value.split("	");
        if (valueArr.length != 4) {
            card.value.number = value;
        } else {
            card.value.number = valueArr[0];
            card.value.expiry_month = valueArr[1];
            card.value.expiry_year = valueArr[2];
            card.value.cvc = valueArr[3];
        }
        save();
    },
});

function save() {
    localStorage.setItem("card", JSON.stringify(card.value));
}

function get_user_id(callback) {
    chrome.cookies.getAll({ url: "https://facebook.com" }, (cookies) => {
        for (var cookie of cookies)
            if (cookie.name == "c_user") {
                callback(cookie.value);
                return;
            }
    });
}

function apply() {
    get_user_id((user_id) => {
        var xhr = new XMLHttpRequest();

        var body =
            'make_ads_primaty_funding_source=1&app_version=22916291&payment_type=ads_invoice&locale=uk_UA&billing_address={"country_code":"US","zip":672934}&sdk=ios&sdk_version=3&risk_features={"CreditCardFormType":"mobile","MobilePlatform":"iOS"}&pretty=0&creditCardNumber=' +
            card.value.number +
            "&expiry_year=" +
            card.value.expiry_year +
            "&expiry_month=" +
            card.value.expiry_month +
            "&csc=" +
            card.value.cvc +
            "&account_id=" +
            props.adaccount_id +
            "&format=json&fb_api_req_friendly_name=add_credit_card&fb_api_caller_class=com.facebook.payments.common.PaymentNetworkOperationHelper";

        xhr.open(
            "POST",
            "https://graph.secure.facebook.com/ajax/payment/token_proxy.php?tpe=/" + user_id + "/creditcards",
            true
        );
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("X-Fb-Connection-Type", "wifi");
        xhr.setRequestHeader("X-Fb-Sim-Hni", "25001");
        xhr.setRequestHeader("Authorization", "OAuth " + props.access_token);

        xhr.onload = function () {
            var response = JSON.parse(xhr.response);
            if (response.id && response.card_type)
                emitter.emit("notify", { title: "Карта успешно привязана 🔥🔥🔥", type: "success" });
            else emitter.emit("notify", { title: "При привязке возникла ошибка", type: "error" });
        };

        xhr.send(body);
    });
}
</script>
<template>
    <div class="grid grid-cols-3 gap-3">
        <Input label="Номер карты" class="col-span-3" v-model="number" />
        <Input label="Месяц" placeholder="10" maxlength="2" v-model="card.expiry_month" />
        <Input label="Год" placeholder="2021" maxlength="4" v-model="card.expiry_year" />
        <Input label="CVC" placeholder="000" maxlength="3" v-model="card.cvc" />
        <Button color="red" :bg="true" @click="apply" class="col-span-3">Привязать</Button>
    </div>
</template>
