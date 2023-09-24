export const arrayWith = <T = number>(n: number, generator?: (n: number) => T) =>
    Array(n).fill(0).map((_, i) => !generator ? i : generator(i));

export const enumKeys = <T extends object>(obj: T) =>
    Object.keys(obj).map((key: string) => obj[key as keyof T]);

export const quantize = (value: number, quant: number) =>
    quant * Math.floor(value / quant);