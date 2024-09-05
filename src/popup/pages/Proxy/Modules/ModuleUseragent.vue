<script setup lang="ts">
import BaseCircleButton from "@/components/Base/Buttons/BaseCircleButton.vue";
import BaseSelect from "@/components/Base/Inputs/BaseSelect.vue";
import BaseTextarea from "@/components/Base/Inputs/BaseTextarea.vue";
import IconRefresh from "@/components/Base/Icons/IconRefresh.vue";
import UAGenerator from "@/classes/UAGenerator";
import { UseragentConfig } from "@/classes/UseragentConfig";
import { onMounted, reactive } from "vue";
import { watch } from "vue";

const uaGenerator = new UAGenerator();

const config = reactive(UseragentConfig.makeFromLocalStorage());

onMounted(() => {
    watch(
        () => config,
        () => config.saveToLocalStorage(),
        { deep: true }
    );
    watch(
        () => config.type,
        (value) => {
            if (value == "generated") generate();
        }
    );
});

function generate() {
    config.generated_value = uaGenerator.generate();
}
</script>
<template>
    <div class="mt-4 px-8">
        <h6 class="text-base mb-4">Useragent</h6>
        <BaseSelect
            v-model="config.type"
            :options="{
                default: 'По умолчанию',
                generated: 'Случайный',
                personal: 'Свой',
            }"
            label="Useragent"
        />
        <div v-if="config.type == 'generated'" class="relative border border-slate-100 p-6 text-sm shadow">
            {{ config.generated_value }}

            <BaseCircleButton :icon="IconRefresh" class="absolute -bottom-5 right-6" @click="generate" />
        </div>
        <BaseTextarea
            v-if="config.type == 'personal'"
            v-model="config.personal_value"
            label="Укажите Useragent"
            placeholder="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.98 Safari/537.36"
        />
    </div>
</template>
