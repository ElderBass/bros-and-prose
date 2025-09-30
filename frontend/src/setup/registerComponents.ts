import BaseAlert from "@/components/ui/BaseAlert.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/form/BaseInput.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseTooltip from "@/components/ui/BaseTooltip.vue";
import FloatingActionButton from "@/components/ui/FloatingActionButton.vue";
import IconButton from "@/components/ui/IconButton.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { App } from "vue";

export const registerComponents = (app: App) => {
    app.component("BaseAlert", BaseAlert);
    app.component("BaseButton", BaseButton);
    app.component("BaseCard", BaseCard);
    app.component("BaseInput", BaseInput);
    app.component("BaseModal", BaseModal);
    app.component("BaseTooltip", BaseTooltip);
    app.component("FloatingActionButton", FloatingActionButton);
    app.component("IconButton", IconButton);
    app.component("LoadingSpinner", LoadingSpinner);
    app.component("FontAwesomeIcon", FontAwesomeIcon);
    app.component("PageTitle", PageTitle);
};
