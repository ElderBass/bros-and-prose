export const getMainLinks = () => {
    return [
        { path: "/past", label: "past" },
        { path: "/present", label: "present" },
        { path: "/future", label: "future" },
    ];
};

export const getOtherLinks = (isMobile = false) => {
    let otherLinks: { path: string; label: string }[] = [
        { path: "/bros", label: "bros" },
        { path: "/palaver", label: "palaver" },
        { path: "/profile", label: "profile" },
    ];
    if (isMobile) {
        otherLinks = otherLinks.filter((l) => l.label !== "profile");
    }

    return otherLinks;
};

export const getMobileLinks = () => {
    return [...getMainLinks(), ...getOtherLinks(true)];
};
