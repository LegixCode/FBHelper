import "floating-vue/dist/style.css";
import "@/assets/main.css";

import PopupApp from "@/PopupApp.vue";
import { createApp } from "vue";
import { vTooltip } from "floating-vue";
import { FBStore } from "@/classes/FB/FBStore";

FBStore.make();

createApp(PopupApp).directive("tooltip", vTooltip).mount("#app");
