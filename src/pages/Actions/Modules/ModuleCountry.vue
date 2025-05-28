<script setup lang="ts">
import BaseButton from "@/components/Base/Buttons/BaseButton.vue";
import BaseInput from "@/components/Base/Inputs/BaseInput.vue";
import BaseSelect from "@/components/Base/Inputs/BaseSelect.vue";
import { CountryConfig } from "@/classes/FB/types/CountryConfig";
import { FBGraphApi } from "@/classes/FB/FBApi";
import { countries } from "@/data/countries";
import { currencies } from "@/data/currencies";
import { reactive, watch } from "vue";
import { timezones } from "@/data/timezones";
import { usStates } from "@/data/states";
import { FBStore } from "@/classes/FB/FBStore";
import { notifyStore } from "@/components/Base/Notify/NotifyStore";

const accessToken = FBStore.self.accessToken;

const props = defineProps<{
    adaccountId: number;
}>();

const form = reactive(CountryConfig.makeFromLocalStorage());

watch(
    () => form,
    () => form.saveToLocalStorage(),
    { deep: true }
);

function apply() {
    const data = {
        timezone_id: form.tz.toString(),
        currency: form.currency,
        business_info: JSON.stringify(
            form.country == "US"
                ? {
                      business_country_code: form.country,
                      business_city: "Los Angeles",
                      business_name: "Carl Johnson",
                      business_state: "${form.value.state}",
                      business_street: "Grove Street",
                      business_zip: form.zip,
                  }
                : {
                      business_country_code: form.country,
                      business_zip: 672934,
                  }
        ),
    };

    FBGraphApi.post(`act_${props.adaccountId}`, data, accessToken.value).then((response) => {
        if (response.success) notifyStore.success("Часовой пояс и валюта изменены");
        else notifyStore.error("Ошибка изменения");
    });
}
</script>
<template>
    <div class="flex flex-col gap-3">
        <BaseSelect v-model="form.tz" label="Часовой пояс" :options="timezones" />
        <BaseSelect v-model="form.country" label="Страна" :options="countries" />
        <template v-if="form.country === 'US'">
            <BaseSelect v-model="form.state" label="Штат" :options="usStates" />
            <BaseInput v-model="form.zip" label="Почтовый индекc" />
        </template>
        <BaseSelect v-model="form.currency" label="Валюта" :options="currencies" />
        <BaseButton label="Изменить страну, ч/п и валюту" color="teal" @click="apply" />
    </div>
</template>
