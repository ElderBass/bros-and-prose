import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faArrowRight,
    faBook,
    faBookBible,
    faBookBookmark,
    faBookOpenReader,
    faEye,
    faEyeSlash,
    faMarker,
    faUserAstronaut,
    faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";

export const registerIcons = () => {
    library.add(
        faArrowRight,
        faBook,
        faBookBible,
        faBookBookmark,
        faBookOpenReader,
        faEye,
        faEyeSlash,
        faMarker,
        faUserAstronaut,
        faXmarkCircle
    );
};
