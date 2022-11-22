import { createWebHistory, createRouter } from "vue-router";
import HelloWorld from "@/components/HelloWorld.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: HelloWorld,
    }, {
        path: "/connect",
        name: "Kornekt",
        component: HelloWorld,
    }
    // , { path: "/:catchAll(.*)", component: NotFound }
];

const router = createRouter({
    history: createWebHistory(),
    base: process.env.BASE_URL,
    routes,
});

export default router;