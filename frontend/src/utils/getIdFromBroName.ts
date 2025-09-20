export const getIdFromBroName = (broName: string) => {
    broName = broName.toLowerCase();
    const [firstName, lastName] = broName.split(" ");
    return `${firstName}_${lastName}`;
};
