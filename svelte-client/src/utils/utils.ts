export const arrayWith = <T>(n: number, generator?: (n: number) => T) =>
    Array(n).fill(0).map((_, i) => !generator ? i : generator(i));
