<script setup>
import Select from "@/components/ui/Select.vue";
import Button from "@/components/ui/Button.vue";
import { ref, inject } from "vue";

const emitter = inject("emitter");

const props = defineProps({
    adaccount_id: Number,
    access_token: String,
});

const times = {
    0: "00:00",
    30: "00:30",
    60: "01:00",
    90: "01:30",
    120: "02:00",
    150: "02:30",
    180: "03:00",
    210: "03:30",
    240: "04:00",
    270: "04:30",
    300: "05:00",
    330: "05:30",
    360: "06:00",
    390: "06:30",
    420: "07:00",
    450: "07:30",
    480: "08:00",
    510: "08:30",
    540: "09:00",
    570: "09:30",
    600: "10:00",
    630: "10:30",
    660: "11:00",
    690: "11:30",
    720: "12:00",
    750: "12:30",
    780: "13:00",
    810: "13:30",
    840: "14:00",
    870: "14:30",
    900: "15:00",
    930: "15:30",
    960: "16:00",
    990: "16:30",
    1020: "17:00",
    1050: "17:30",
    1080: "18:00",
    1110: "18:30",
    1140: "19:00",
    1170: "19:30",
    1200: "20:00",
    1230: "20:30",
    1260: "21:00",
    1290: "21:30",
    1320: "22:00",
    1350: "22:30",
    1380: "23:00",
    1410: "23:30",
    1440: "24:00",
};

const form = ref({
    start: 750,
    end: 1350,
});

function get_user_id(callback) {
    chrome.cookies.getAll({ url: "https://facebook.com" }, (cookies) => {
        for (var cookie of cookies)
            if (cookie.name == "c_user") {
                callback(cookie.value);
                return;
            }
    });
}

function create_rule(rule_param, callback) {
    var xhr = new XMLHttpRequest();
    var body = "status=ENABLED";
    for (var key in rule_param) {
        body += `&${key}=${rule_param[key]}`;
    }
    body += "&access_token=" + props.access_token;

    xhr.open("POST", "https://graph.facebook.com/v11.0/act_" + props.adaccount_id + "/adrules_library", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
        var data = JSON.parse(xhr.response);
        callback(data);
    };

    xhr.send(body);
}

function apply() {
    get_user_id((user_id) => {
        var rules = [
            {
                name: "start",
                evaluation_spec:
                    '{"evaluation_type":"SCHEDULE","filters":[{"field":"entity_type","value":"CAMPAIGN","operator":"EQUAL"},{"field":"time_preset","value":"MAXIMUM","operator":"EQUAL"}]}',
                execution_spec: `{"execution_type":"UNPAUSE","execution_options":[{"field":"user_ids","value":["${user_id}"],"operator":"EQUAL"},{"field":"alert_preferences","value":{"instant":{"trigger":"CHANGE"}},"operator":"EQUAL"}]}`,
                schedule_spec: `{"schedule_type":"CUSTOM","schedule":[{"days":[0,1,2,3,4,5,6],"start_minute":${form.value.start},"end_minute":${form.value.start}}]}`,
            },
            {
                name: "stop",
                evaluation_spec:
                    '{"evaluation_type":"SCHEDULE","filters":[{"field":"entity_type","value":"CAMPAIGN","operator":"EQUAL"},{"field":"time_preset","value":"MAXIMUM","operator":"EQUAL"}]}',
                execution_spec: `{"execution_type":"PAUSE","execution_options":[{"field":"user_ids","value":["${user_id}"],"operator":"EQUAL"},{"field":"alert_preferences","value":{"instant":{"trigger":"CHANGE"}},"operator":"EQUAL"}]}`,
                schedule_spec: `{"schedule_type":"CUSTOM","schedule":[{"days":[0,1,2,3,4,5,6],"start_minute":${form.value.stop},"end_minute":${form.value.stop}}]}`,
            },
        ];
        create_rule(rules[0], (response) => {
            if (response.id)
                create_rule(rules[1], (response2) => {
                    if (response2.id) emitter.emit("notify", { title: "Правила созданы", type: "success" });
                    else emitter.emit("notify", { title: "Ошибка создания правил", type: "error" });
                });
            else emitter.emit("notify", { title: "Ошибка создания правил", type: "error" });
        });
    });
}
</script>
<template>
    <div class="grid grid-cols-2 gap-3">
        <Select label="Старт кампаний" v-model="form.start">
            <option v-for="(time, code) of times" :value="code" :key="code">{{ time }}</option>
        </Select>
        <Select label="Стоп кампаний" v-model="form.end">
            <option v-for="(time, code) of times" :value="code" :key="code">{{ time }}</option>
        </Select>
        <Button color="teal" :bg="true" @click="apply" class="col-span-3">Создать правила</Button>
    </div>
</template>
