<script setup>
import Country from "@/components/Actions/Country.vue";
import Pixel from "@/components/Actions/Pixel.vue";
import Card from "@/components/Actions/Card.vue";
import Rules from "@/components/Actions/Rules.vue";
import Select from "@/components/ui/Select.vue";
import Button from "@/components/ui/Button.vue";
import { computed, ref } from "vue";

const props = defineProps({
    fb_data: Object,
});
const selected_adaccount_id = ref(props.fb_data.adaccounts[0].account_id);
const selected_adaccount = computed(() => {
    return props.fb_data.adaccounts.find((adaccount) => adaccount.account_id == selected_adaccount_id.value);
});
</script>
<template>
    <div class="px-8 mt-4">
        <h6 class="text-base">Рекламные аккаунты</h6>
        <Select label="Рекламмный аккаунт" class="mt-4" v-model="selected_adaccount_id">
            <option v-for="adaccount of props.fb_data.adaccounts" :key="adaccount.id" :value="adaccount.account_id">
                {{ adaccount.name }} {{ !adaccount.card ? `` : ` | ${adaccount.card}` }} |
                {{ adaccount.status }}
            </option>
        </Select>
        <div class="grid grid-cols-2 mt-6 items-center">
            <div class="pr-3">
                <Country :adaccount_id="selected_adaccount_id" :access_token="fb_data.access_token" />
                <template v-if="!selected_adaccount.has_pixel">
                    <hr class="my-3 text-slate-300" />
                    <Pixel :adaccount_id="selected_adaccount_id" :access_token="fb_data.access_token" />
                </template>
            </div>
            <div class="pl-3 border-l border-slate-300">
                <Card :adaccount_id="selected_adaccount_id" :access_token="fb_data.access_token" />
                <hr class="my-3 text-slate-300" />
                <Rules :adaccount_id="selected_adaccount_id" :access_token="fb_data.access_token" />
            </div>
        </div>
    </div>
</template>
