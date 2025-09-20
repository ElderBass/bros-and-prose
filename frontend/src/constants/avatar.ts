import {
    faBaby,
    faBeerMugEmpty,
    faBomb,
    faCat,
    faDog,
    faDragon,
    faGamepad,
    faGhost,
    faPizzaSlice,
    faRobot,
    faUserAstronaut,
    faUserNinja,
    faUserTie,
} from "@fortawesome/free-solid-svg-icons";

export const AVATAR_ICON_LIST = [
    faBaby,
    faBeerMugEmpty,
    faBomb,
    faCat,
    faDog,
    faDragon,
    faGamepad,
    faGhost,
    faPizzaSlice,
    faRobot,
    faUserAstronaut,
    faUserNinja,
    faUserTie,
];

export const avatarIconMap = {
    baby: "big baby",
    "beer-mug-empty": "beer stein",
    bomb: "da bomb",
    cat: "cat's meow",
    dog: "doggo",
    dragon: "targaryen",
    gamepad: "gamer",
    ghost: "spooky boi",
    "pizza-slice": "pizza slice",
    robot: "robobro",
    "user-astronaut": "astronaut",
    "user-ninja": "ninja",
    "user-tie": "fancy pants",
};

export const avatarIcons = AVATAR_ICON_LIST.map((icon) => ({
    name: icon.iconName,
    friendlyName: avatarIconMap[icon.iconName as keyof typeof avatarIconMap],
    icon: icon,
}));
