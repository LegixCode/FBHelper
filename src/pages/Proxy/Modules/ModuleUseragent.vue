<script setup lang="ts">
import BaseButton from "@/components/Base/Buttons/BaseButton.vue";
import BaseSelect from "@/components/Base/Inputs/BaseSelect.vue";
import BaseTextarea from "@/components/Base/Inputs/BaseTextarea.vue";
import UAGenerator from "@/utils/UAGenerator";
import { UseragentConfig } from "@/classes/UseragentConfig";
import { activateUseragentRule, deactivateUseragentRule } from "@/utils/chromeMethods";
import { onMounted, reactive } from "vue";
import { watch } from "vue";

const uaGenerator = new UAGenerator();

const config = reactive<UseragentConfig>(UseragentConfig.makeFromLocalStorage());

onMounted(() => {
    watch(
        () => config,
        (newValue, oldValue) => {
            if (oldValue) config.saveToLocalStorage();
            config.type == "custom" && config.value.length
                ? activateUseragentRule(config.value)
                : deactivateUseragentRule();
        },
        { deep: true }
    );
});

function generate() {
    config.value = uaGenerator.generate();
}
</script>
<template>
    <div v-if="config" class="mt-4 px-8">
        <h6 class="mb-4 text-base">Useragent</h6>
        <div class="flex gap-3">
            <BaseSelect
                v-model="config.type"
                :options="{
                    default: 'По умолчанию',
                    custom: 'Свой',
                }"
                label="Useragent"
                class="grow"
            />
            <BaseButton v-if="config.type == 'custom'" label="Сгенерировать" color="teal" @click="generate" />
        </div>
        <BaseTextarea
            v-if="config.type == 'custom'"
            v-model="config.value"
            label="Укажите Useragent"
            placeholder="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.98 Safari/537.36"
            class="mt-3"
        />
    </div>
</template>
