import { AVATAR_ICON_LIST } from "@/constants";
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";

export const getAvatar = (avatar: string) => {
    return (
        AVATAR_ICON_LIST.find((icon) => icon.iconName === avatar) ??
        faUserAstronaut
    );
};
