import { createApp } from "vue";
import App from "./App.vue";
import FloatingVue from "floating-vue";
import mitt from "mitt";

import "floating-vue/dist/style.css";
import "./assets/main.css";

createApp(App).use(FloatingVue).provide("emitter", mitt()).mount("#app");
