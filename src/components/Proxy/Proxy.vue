<script setup>
import { computed, onMounted, reactive, watch } from "vue";
import Input from "@/components/ui/Input.vue";

const proxy = reactive({
    activated: true,
    host: "",
    port: "",
    username: "",
    password: "",
});
onMounted(() => {
    var proxy_data = localStorage.getItem("proxy");
    if (proxy_data) {
        proxy_data = JSON.parse(proxy_data);
        proxy.activated = proxy_data.activated;
        proxy.host = proxy_data.host;
        proxy.port = proxy_data.port;
        proxy.username = proxy_data.username;
        proxy.password = proxy_data.password;
    }
    watch(() => proxy.port, save);
    watch(() => proxy.username, save);
    watch(() => proxy.password, save);
});

function save() {
    localStorage.setItem("proxy", JSON.stringify(proxy));
    activate();  
}
function activate() {
    if (typeof InstallTrigger !== "undefined") return;
    if (proxy.activated) {
        var config = {
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    scheme: "http",
                    host: proxy.host,
                    port: parseInt(proxy.port),
                },
            },
        };
        chrome.proxy.settings.set({ value: config, scope: "regular" }, function () {});
    } else {
        var config = {
            mode: "system",
        };
        chrome.proxy.settings.set({ value: config, scope: "regular" }, function () {});
    }
}

watch(() => proxy.activated, save);
const host = computed({
    get() {
        return proxy.host;
    },
    set(value) {
        var valueArr = value.split(" ");
        if (valueArr.length == 1) valueArr = value.split("	");
        if (valueArr.length != 4) {
            proxy.host = value;
        } else {
            proxy.host = valueArr[0];
            proxy.port = valueArr[1];
            proxy.username = valueArr[2];
            proxy.password = valueArr[3];
        }
        save();
    },
});
</script>
<template>
    <div class="px-8 mt-4">
        <div class="flex items-center justify-between">
            <h6 class="text-base">Прокси</h6>

            <div class="switch">
                <label>
                    Выкл
                    <input type="checkbox" v-model="proxy.activated" />
                    <span class="lever"></span>
                    Вкл
                </label>
            </div>
        </div>
        <div class="grid grid-cols-12 gap-6 mt-6">
            <Input class="col-span-4" v-model="host" placeholder="127.0.0.1" label="Хост" />
            <Input class="col-span-2" v-model="proxy.port" placeholder="8000" label="Порт" />
            <Input class="col-span-3" v-model="proxy.username" label="Логин" />
            <Input class="col-span-3" v-model="proxy.password" label="Пароль" />
        </div>
    </div>
</template>
