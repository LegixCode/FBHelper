<script setup>
import { computed } from "@vue/reactivity";
import { onMounted, reactive } from "vue";
import Select from "@/components/ui/Select.vue";
import Textarea from "@/components/ui/Textarea.vue";
import UAGenerator from "@/classes/UAGenerator.js";

var uaGenerator = new UAGenerator();

const config = reactive({
    type: "default",
    generated_value: "",
    personal_value: "",
});

onMounted(() => {
    var ua = localStorage.getItem("ua");
    if (ua) {
        ua = JSON.parse(ua);
        config.type = ua.type;
        config.generated_value = ua.generated_value;
        config.personal_value = ua.personal_value;
    }
});

const type = computed({
    get() {
        return config.type;
    },
    set(value) {
        config.type = value;
        if (config.type == "generated") config.generated_value = uaGenerator.generate();
        save();
    },
});
const personal_value = computed({
    get() {
        return config.personal_value;
    },
    set(value) {
        config.personal_value = value;
        save();
    },
});

function Generate() {
    config.generated_value = uaGenerator.generate();
    save();
}

function save() {
    localStorage.setItem("ua", JSON.stringify(config));
}
</script>
<template>
    <div class="px-8 mt-4">
        <h6 class="text-base">Useragent</h6>
        <Select label="Useragent" v-model="type" class="my-6">
            <option value="default">По умолчанию</option>
            <option value="generated">Случайный</option>
            <option value="personal">Свой</option>
        </Select>
        <div class="shadow p-6 relative text-sm border border-slate-100" v-if="config.type == 'generated'">
            {{ config.generated_value }}

            <button
                type="button"
                class="absolute rounded-full right-6 -bottom-5 p-2 bg-red hover:bg-red-dark text-white"
                @click="Generate"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4m-4 4a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"
                    />
                </svg>
            </button>
        </div>
        <Textarea
            v-if="config.type == 'personal'"
            label="Укажите Useragent"
            placeholder="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.98 Safari/537.36"
            v-model="personal_value"
        />
    </div>
</template>
