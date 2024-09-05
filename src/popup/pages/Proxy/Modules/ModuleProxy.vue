<script setup lang="ts">
import BaseInput from "@/components/Base/Inputs/BaseInput.vue";
import BaseToggle from "@/components/Base/Inputs/BaseToggle.vue";
import { computed, reactive, watch } from "vue";
import { setProxy } from "@/classes/chromeMethods";
import { ProxyConfig } from "@/classes/ProxyConfig";

const proxy = reactive(ProxyConfig.makeFromLocalStorage());

watch(
    () => proxy,
    () => {
        proxy.saveToLocalStorage();
        activate();
    },
    { deep: true }
);

function activate() {
    if (typeof InstallTrigger !== "undefined") return;
    if (proxy.activated) {
        setProxy({
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    scheme: "http",
                    host: proxy.host,
                    port: parseInt(proxy.port),
                },
            },
        });
    } else {
        setProxy({
            mode: "system",
        });
    }
}

const host = computed<string>({
    get: () => proxy.host,
    set: (value) => {
        let splited: string[] = value.trim().split(" ");
        if (splited.length === 1) splited = value.split("	");
        if (splited.length !== 4) {
            proxy.host = value;
        } else {
            proxy.host = splited[0];
            proxy.port = splited[1];
            proxy.username = splited[2];
            proxy.password = splited[3];
        }
    },
});
</script>
<template>
    <div class="mt-4 px-8">
        <div class="flex items-center justify-between">
            <h6 class="text-base">Прокси</h6>
            <BaseToggle v-model="proxy.activated" />
        </div>
        <div class="mt-6 grid grid-cols-12 gap-6">
            <BaseInput v-model="host" class="col-span-4" placeholder="127.0.0.1" label="Хост" />
            <BaseInput v-model="proxy.port" class="col-span-2" placeholder="8000" label="Порт" />
            <BaseInput v-model="proxy.username" class="col-span-3" label="Логин" />
            <BaseInput v-model="proxy.password" class="col-span-3" label="Пароль" />
        </div>
    </div>
</template>
