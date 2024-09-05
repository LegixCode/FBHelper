<script setup lang="ts">
import BaseButton from "@/components/Base/Buttons/BaseButton.vue";
import BaseSelect from "@/components/Base/Inputs/BaseSelect.vue";
import { FBGraphApi } from "@/classes/FB/FBApi";
import { FBStore } from "@/classes/FB/FBStore";
import { notifyStore } from "@/components/Base/Notify/NotifyStore";
import { ref } from "vue";
import { ruleTimes } from "@/data/ruleTimes";

const accessToken = FBStore.self.accessToken,
    userId = FBStore.self.userId;

const props = defineProps<{
    adaccountId: number;
}>();

const form = ref({
    start: 750,
    end: 1350,
});

function create_rule(ruleData: object) {
    return FBGraphApi.post(
        `act_${props.adaccountId}/adrules_library`,
        {
            status: "ENABLED",
            ...ruleData,
        },
        accessToken.value
    );
}

function apply() {
    const rules = [
        {
            name: "start",
            evaluation_spec:
                '{"evaluation_type":"SCHEDULE","filters":[{"field":"entity_type","value":"CAMPAIGN","operator":"EQUAL"},{"field":"time_preset","value":"MAXIMUM","operator":"EQUAL"}]}',
            execution_spec: `{"execution_type":"UNPAUSE","execution_options":[{"field":"user_ids","value":["${userId.value}"],"operator":"EQUAL"},{"field":"alert_preferences","value":{"instant":{"trigger":"CHANGE"}},"operator":"EQUAL"}]}`,
            schedule_spec: `{"schedule_type":"CUSTOM","schedule":[{"days":[0,1,2,3,4,5,6],"start_minute":${form.value.start},"end_minute":${form.value.start}}]}`,
        },
        {
            name: "stop",
            evaluation_spec:
                '{"evaluation_type":"SCHEDULE","filters":[{"field":"entity_type","value":"CAMPAIGN","operator":"EQUAL"},{"field":"time_preset","value":"MAXIMUM","operator":"EQUAL"}]}',
            execution_spec: `{"execution_type":"PAUSE","execution_options":[{"field":"user_ids","value":["${userId.value}"],"operator":"EQUAL"},{"field":"alert_preferences","value":{"instant":{"trigger":"CHANGE"}},"operator":"EQUAL"}]}`,
            schedule_spec: `{"schedule_type":"CUSTOM","schedule":[{"days":[0,1,2,3,4,5,6],"start_minute":${form.value.end},"end_minute":${form.value.end}}]}`,
        },
    ];
    create_rule(rules[0]).then((response) => {
        if (response.id)
            create_rule(rules[1]).then((response) => {
                if (response.id) notifyStore.success("Правила созданы");
                else notifyStore.error("Ошибка создания правил");
            });
        else notifyStore.error("Ошибка создания правил");
    });
}
</script>
<template>
    <div class="grid grid-cols-2 gap-3">
        <BaseSelect v-model="form.start" label="Старт кампаний" :options="ruleTimes" />
        <BaseSelect v-model="form.end" label="Стоп кампаний" :options="ruleTimes" />
        <BaseButton label="Создать правила" color="teal" class="col-span-3" @click="apply" />
    </div>
</template>
