

export const counted = (count: number | unknown[], singular: string, plural?: string): string => {
    plural ??= singular + 's';
    if (count instanceof Array) {
        return counted(count.length, singular, plural);
    }
    return `${count} ${count === 1 ? singular : plural}`;
};
