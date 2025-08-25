import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faEye,
    faEyeSlash,
    faArrowRight,
    faBookBible,
} from "@fortawesome/free-solid-svg-icons";

export const registerIcons = () => {
    library.add(faEye, faEyeSlash, faArrowRight, faBookBible);
};
