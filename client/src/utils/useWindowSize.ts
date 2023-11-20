import React from "react";

const useWindowSize = () => {
    const [size, setSize] = React.useState<{width: number, height: number} | undefined>();

    React.useEffect(() => {
        const onResize = () => setSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    console.log("löl", window.screen.orientation, window.screen);

    return size;
};

export default useWindowSize;
