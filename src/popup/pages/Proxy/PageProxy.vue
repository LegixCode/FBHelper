<script setup lang="ts">
import ModuleCurrencyConverter from "@/pages/Proxy/Modules/ModuleCurrencyConverter.vue";
import ModuleDisablePopup from "@/pages/Proxy/Modules/ModuleDisablePopup.vue";
import Proxy from "@/pages/Proxy/Modules/ModuleProxy.vue";
import Translate from "@/pages/Proxy/Modules/ModuleTranslate.vue";
import Useragent from "@/pages/Proxy/Modules/ModuleUseragent.vue";
</script>
<template>
    <Proxy />
    <hr class="my-6 text-slate-300" />
    <Useragent />
    <hr class="my-6 text-slate-300" />
    <Translate />
    <ModuleDisablePopup />
    <ModuleCurrencyConverter />
</template>
