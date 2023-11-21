import React from "react";

const buildTransform = (x: number, y: number, transform?: string) => {
    const result = `translate(${x} ${y})`;
    return transform ? `${result} ${transform}` : result;
};

export const Group = ({x, y, ...props}: {x?: number, y?: number} & React.SVGProps<SVGGElement>) =>
    <g
        transform = {buildTransform(x ?? 0, y ?? 0, props.transform)}
        {...props}
    />;
