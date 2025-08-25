import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router.ts";
import { registerIcons, registerComponents } from "./setup";
import vuetify from "./plugins";

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(vuetify);

registerIcons();
registerComponents(app);

app.mount("#app");
