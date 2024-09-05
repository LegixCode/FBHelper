import "floating-vue/dist/style.css";
import "./assets/main.css";

import App from "./App.vue";
import { createApp } from "vue";
import { vTooltip } from "floating-vue";
import { FBStore } from "@/classes/FB/FBStore";

FBStore.make();

createApp(App).directive("tooltip", vTooltip).mount("#app");
