export const useLvl = () => {
    return {
        maxLvl: 12,
        minLvl: 1,
        lvls: Array.from({ length: 12 }, (_, i) => i + 1).reverse(),
    }
}