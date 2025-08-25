import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: () => import("@/views/Landing.vue") },
        { path: "/home", component: () => import("@/views/Home.vue") },
        // { path: "/ping-me", component: PingMe },
        // { path: "/prolixities", component: VariousProlixities },
    ],
});

export default router;
