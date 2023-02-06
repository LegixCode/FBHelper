<script setup>
import { computed, onMounted, reactive, ref } from "vue";

const translate = reactive({
    is_active: false,
});

onMounted(() => {
    var data = localStorage.getItem("translate");
    if (data) {
        try {
            data = JSON.parse(data);
            translate.is_active = data.is_active;
        } catch (e) {
            translate.is_active = false;
        }
    }
});

const is_active = computed({
    get() {
        return translate.is_active;
    },
    set(value) {
        translate.is_active = value;
        localStorage.setItem("translate", JSON.stringify(translate));
    },
});
</script>
<template>
    <div class="px-8 mt-4">
        <div class="flex items-center justify-between">
            <h6 class="text-base">Переводить на русский</h6>

            <div class="switch">
                <label>
                    Выкл
                    <input type="checkbox" v-model="is_active" />
                    <span class="lever"></span>
                    Вкл
                </label>
            </div>
        </div>
    </div>
</template>
