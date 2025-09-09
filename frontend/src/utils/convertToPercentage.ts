export const convertToPercentage = (current: number, total: number) => {
    return Math.round((current / total) * 100);
};
