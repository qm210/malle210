import {Router} from "@tanstack/react-router";

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof Router
    }
}
