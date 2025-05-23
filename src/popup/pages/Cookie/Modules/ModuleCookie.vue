<script setup lang="ts">
import BaseButton from "@/components/Base/Buttons/BaseButton.vue";
import BaseCircleButton from "@/components/Base/Buttons/BaseCircleButton.vue";
import ClipboardContent from "@/components/Base/ClipboardContent.vue";
import IconTrash from "@/components/Base/Icons/IconTrash.vue";
import { ICookiesItem, netscapeToJson } from "@/classes/cookies";
import { getCookies, removeCookies, setCookies } from "@/classes/chromeMethods";
import { onMounted, ref } from "vue";

let jsonCookies = ref<string>("[]");

onMounted(refreshCookies);

function refreshCookies() {
    getCookies((cookies) => (jsonCookies.value = JSON.stringify(cookies)));
}

function saveCookies() {
    let cookies: ICookiesItem[] = JSON.parse(jsonCookies.value);
    setCookies(cookies);
}
</script>
<template>
    <div class="mt-4 px-8">
        <h6 class="text-base">Cookie JSON</h6>
        <div class="relative">
            <textarea
                v-model="jsonCookies"
                placeholder=""
                class="mt-4 h-36 w-full border-b border-slate-300 text-[9px] leading-tight placeholder:opacity-0 focus:border-teal focus:shadow-[0_1px_0_0_#26a69a] focus:outline-hidden focus:placeholder:opacity-100"
            ></textarea>

            <BaseCircleButton
                :icon="IconTrash"
                class="absolute -bottom-3 right-6"
                @click="removeCookies(refreshCookies)"
            />
        </div>
        <div class="mt-8 flex justify-between">
            <div class="flex gap-3">
                <BaseButton label="СОХРАНИТЬ" color="red" @click="saveCookies" />
                <ClipboardContent :value="jsonCookies" message="Куки скопированы">
                    <BaseButton label="СКОПИРОВАТЬ" color="teal" />
                </ClipboardContent>
            </div>
            <BaseButton label="NETSCAPE→JSON" color="white" @click="jsonCookies = netscapeToJson(jsonCookies)" />
        </div>
    </div>
</template>
