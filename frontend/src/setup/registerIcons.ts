import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faArrowRight,
    faBookBible,
    faBookOpenReader,
    faEye,
    faEyeSlash,
    faUserAstronaut,
} from "@fortawesome/free-solid-svg-icons";

export const registerIcons = () => {
    library.add(
        faArrowRight,
        faBookBible,
        faBookOpenReader,
        faEye,
        faEyeSlash,
        faUserAstronaut
    );
};
