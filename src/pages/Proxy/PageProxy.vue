<script setup lang="ts">
import ModuleCurrencyConverter from "./Modules/ModuleCurrencyConverter.vue";
import ModuleDisablePopup from "./Modules/ModuleDisablePopup.vue";
import Proxy from "./Modules/ModuleProxy.vue";
import Translate from "./Modules/ModuleTranslate.vue";
import Useragent from "./Modules/ModuleUseragent.vue";
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
