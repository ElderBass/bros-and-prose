import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/form/BaseInput.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { App } from "vue";

export const registerComponents = (app: App) => {
    app.component("BaseButton", BaseButton);
    app.component("BaseInput", BaseInput);
    app.component("BaseCard", BaseCard);
    app.component("LoadingSpinner", LoadingSpinner);
    app.component("FontAwesomeIcon", FontAwesomeIcon);
};
