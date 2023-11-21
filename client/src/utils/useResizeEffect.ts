import React from "react";
import {Size} from "../types/types";


const useResizeEffect = (ref: React.MutableRefObject<HTMLDivElement | null>, callback: (widht: number, height: number) => void) => {

    React.useLayoutEffect(() => {
        if (!ref.current) {
            return;
        }
        const ro = new ResizeObserver(() => {
            const style = getComputedStyle(ref.current!);
            const borderWidth = parseInt(style.borderLeftWidth) + parseInt(style.borderRightWidth)
            const borderHeight = parseInt(style.borderTopWidth) + parseInt(style.borderBottomWidth);
            callback(
                ref.current!.clientWidth - borderWidth,
                ref.current!.clientHeight - borderHeight,
            );
        });
        ro.observe(ref.current);
        return () => {
            ro.disconnect();
        };
    }, [ref]);
};

export default useResizeEffect;


const useSizeOf = (ref: any) => {
    const [size, setSize] =
        React.useState<Size>({width: 0, height: 0});

    useResizeEffect(ref, () => {
        setSize({
            width: ref.current!.offsetWidth,
            height: ref.current!.offsetHeight,
        });
    });

    return size;
};

export const useRefWithSize = <T>() => {
    const ref = React.useRef<T | null>(null);
    const size = useSizeOf(ref);
    return {ref, ...size};
};
