import App from "./app";
import {RootRoute, Route, Router} from "@tanstack/react-router";
import PatternPage from "../pages/PatternPage";
import PlaceholderPage from "../pages/PlaceholderPage";


const rootRoute = new RootRoute({
    component: App,
});

const routeTree = rootRoute.addChildren([
    new Route({
        getParentRoute: () => rootRoute,
        path: "/",
        component: PatternPage,
    }),
    new Route({
        getParentRoute: () => rootRoute,
        path: "/devel",
        component: PlaceholderPage,
    })
]);

const router = new Router({ routeTree });

export default router;
