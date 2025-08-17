import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// import store from "./store";

import vuetify from "./plugins";

// createApp(App).use(router).use(store).use(vuetify).mount("#app");
createApp(App).use(router).use(vuetify).mount("#app");
