<script setup>
import Button from "@/components/ui/Button.vue";
import { inject } from "vue";

const emitter = inject("emitter");

const props = defineProps({
    adaccount_id: Number,
    access_token: String,
});

function apply() {
    var xhr = new XMLHttpRequest();

    var body = "name=MyPixel&access_token=" + props.access_token;

    xhr.open("POST", "https://graph.facebook.com/v15.0/act_" + props.adaccount_id + "/adspixels", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
        var response = JSON.parse(xhr.response);
        if (response.id) emitter.emit("notify", { title: "Пиксель создан", type: "success" });
        else emitter.emit("notify", { title: "Ошибка создания пикселя", type: "error" });
    };

    xhr.send(body);
}
</script>
<template>
    <Button color="teal" :bg="true" class="w-full" @click="apply">Создать пиксель</Button>
</template>
