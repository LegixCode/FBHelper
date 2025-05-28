<script setup lang="ts">
import BaseInput from "@/components/Base/Inputs/BaseInput.vue";
import BaseToggle from "@/components/Base/Inputs/BaseToggle.vue";
import { computed, ref, watch } from "vue";
import { setProxy } from "@/utils/chromeMethods";
import { ProxyConfig } from "@/classes/ProxyConfig";

const proxy = ref<ProxyConfig>();
ProxyConfig.makeFromChromeStorage((proxyConfig) => (proxy.value = proxyConfig));
watch(
    () => proxy.value,
    (newValue, oldValue) => {
        if (oldValue) {
            proxy.value.saveToChromeStorage();
            activate();
        }
    },
    { deep: true }
);

function activate() {
    if (typeof InstallTrigger !== "undefined") return;
    if (proxy.value.activated) {
        setProxy({
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    scheme: "http",
                    host: proxy.value.host,
                    port: parseInt(proxy.value.port),
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
    get: () => proxy.value.host,
    set: (value) => {
        let splited: string[] = value.trim().split(" ");
        if (splited.length === 1) splited = value.split("	");
        if (splited.length !== 4) {
            proxy.value.host = value;
        } else {
            proxy.value.host = splited[0];
            proxy.value.port = splited[1];
            proxy.value.username = splited[2];
            proxy.value.password = splited[3];
        }
    },
});
</script>
<template>
    <div v-if="proxy" class="mt-4 px-8">
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
