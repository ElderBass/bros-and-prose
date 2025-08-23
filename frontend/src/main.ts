import { createApp } from "vue";
import { createPinia } from 'pinia'
import App from "./App.vue";
import router from "./router.ts";
import BaseButton from "./components/ui/BaseButton.vue";
import BaseInput from "./components/ui/BaseInput.vue";
import LoadingSpinner from "./components/ui/LoadingSpinner.vue";

import vuetify from "./plugins";

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(vuetify);

app.component("BaseButton", BaseButton);
app.component("BaseInput", BaseInput);
app.component("LoadingSpinner", LoadingSpinner);

app.mount("#app");
