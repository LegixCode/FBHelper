<script setup lang="ts">
import BaseButton from "@/components/Base/Buttons/BaseButton.vue";
import { FBGraphApi } from "@/classes/FB/FBApi";
import { FBStore } from "@/classes/FB/FBStore";
import { notifyStore } from "@/components/Base/Notify/NotifyStore";

const accessToken = FBStore.self.accessToken;

const props = defineProps<{
    adaccountId: number;
}>();

function apply() {
    FBGraphApi.post(
        `act_${props.adaccountId}/adspixels`,
        {
            name: "MyPixel",
        },
        accessToken.value
    ).then((response) => {
        if (response.id) notifyStore.success("Пиксель создан");
        else notifyStore.error("Ошибка создания пикселя");
    });
}
</script>
<template>
    <BaseButton label="Создать пиксель" color="teal" class="w-full" @click="apply" />
</template>
