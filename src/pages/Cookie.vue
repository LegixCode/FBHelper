<script setup>
import { ref } from "vue";
import Button from "@/components/ui/Button.vue";
import CopyWrapper from "../components/ui/CopyWrapper.vue";

var cookie = ref("");

function refresh_cookies() {
    chrome.cookies.getAll({ url: "https://facebook.com" }, (json_cookies) => {
        cookie.value = JSON.stringify(json_cookies);
    });
}
refresh_cookies();

function remove_cookie() {
    chrome.cookies.getAll({ url: "https://facebook.com" }, (cookies) => {
        cookies.forEach((_cookie) => {
            chrome.cookies.remove({
                url: "https://facebook.com/",
                name: _cookie.name,
            });
        });
        refresh_cookies();
    });
}

function save_cookie() {
    var cookies = JSON.parse(cookie.value);
    cookies.forEach((_cookie) => {
        if (_cookie.domain != ".facebook.com") return;
        var clear_cookie = {
            url: "https://www.facebook.com",
            domain: _cookie.domain,
            path: _cookie.path,
            name: _cookie.name,
            value: _cookie.value,
            expirationDate: _cookie.expirationDate,
        };
        chrome.cookies.set(clear_cookie, () => {});
    });
}

function NetscapeToJson() {
    var cookies = cookie.value;
    var arrObjects = [];
    var arrayOfLines = cookies.split("\n");
    for (var i = 0; i < arrayOfLines.length; i++) {
        var kuka = arrayOfLines[i].split("\t");
        var cook = new Object();
        cook.domain = kuka[0];
        cook.expirationDate = parseInt(kuka[4]);

        if (kuka[1] == "FALSE") cook.httpOnly = false;
        if (kuka[1] == "TRUE") cook.httpOnly = true;

        cook.name = kuka[5];
        cook.path = kuka[2];

        if (kuka[3] == "FALSE") cook.secure = false;
        if (kuka[3] == "TRUE") cook.secure = true;

        cook.value = kuka[6];

        arrObjects[i] = cook;
    }
    cookie.value = JSON.stringify(arrObjects);
}
</script>
<template>
    <div class="px-8 mt-4">
        <h6 class="text-base">Cookie JSON</h6>
        <div class="relative">
            <textarea
                placeholder=""
                class="w-full focus:outline-none placeholder:opacity-0 focus:placeholder:opacity-100 border-b border-slate-300 focus:border-teal focus:shadow-[0_1px_0_0_#26a69a] mt-4 text-[9px] leading-tight h-36"
                v-model="cookie"
            ></textarea>

            <button
                type="button"
                class="absolute rounded-full right-6 -bottom-4 p-3 bg-red hover:bg-red-dark text-white"
                @click="remove_cookie"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"
                    />
                </svg>
            </button>
        </div>
        <div class="flex justify-between mt-8">
            <div class="flex gap-3">
                <Button color="red" :bg="true" @click="save_cookie">СОХРАНИТЬ</Button>
                <CopyWrapper :value="cookie" message="Куки скопированы">
                    <Button color="teal" :bg="true">СКОПИРОВАТЬ</Button>
                </CopyWrapper>
            </div>
            <Button color="gray" @click="NetscapeToJson">NETSCAPE→JSON</Button>
        </div>
    </div>
</template>
