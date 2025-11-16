import { IS_PALAVER_ENABLED } from "@/constants";

export const getMainLinks = () => {
    return [
        { path: "/past", label: "past" },
        { path: "/present", label: "present" },
        { path: "/future", label: "future" },
    ];
};

export const getOtherLinks = (isMobile = false) => {
    let otherLinks: { path: string; label: string }[] = [
        { path: "/palaver", label: "palaver" },
        { path: "/profile", label: "profile" },
    ];
    if (isMobile) {
        otherLinks = otherLinks.filter((l) => l.label !== "profile");
    }
    if (!IS_PALAVER_ENABLED) {
        otherLinks = otherLinks.filter((l) => l.label !== "palaver");
    }
    return otherLinks;
};

export const getMobileLinks = () => {
    return [...getMainLinks(), ...getOtherLinks(true)];
};
