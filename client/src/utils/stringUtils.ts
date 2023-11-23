

export const counted = (count: number | unknown[], singular: string, plural?: string): string => {
    plural ??= singular + 's';
    if (count instanceof Array) {
        return counted(count.length, singular, plural);
    }
    return `${count} ${count === 1 ? singular : plural}`;
};

export const notOrWithSign = (count: number, suffix: string) => {
    if (count === 0) {
        return "";
    }
    const prefix = count > 0 ? "+" : "";
    return `${prefix}${count} ${suffix}`;
};
