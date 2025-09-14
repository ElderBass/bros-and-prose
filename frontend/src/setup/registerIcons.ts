import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faArrowRight,
    faBook,
    faBookBible,
    faBookBookmark,
    faBookOpen,
    faBookOpenReader,
    faEye,
    faEyeSlash,
    faGlasses,
    faHandMiddleFinger,
    faHandPeace,
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
        faBookOpen,
        faBookOpenReader,
        faEye,
        faEyeSlash,
        faGlasses,
        faHandPeace,
        faHandMiddleFinger,
        faMarker,
        faUserAstronaut,
        faXmarkCircle
    );
};
