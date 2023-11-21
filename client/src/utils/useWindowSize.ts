import React from "react";

const useWindowSize = () => {
    const [size, setSize] =
        React.useState<{width: number, height: number}>({width: 0, height: 0});

    React.useEffect(() => {
        const onResize = () => setSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
        window.addEventListener('resize', onResize);
        onResize();
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return size;
};

export default useWindowSize;
