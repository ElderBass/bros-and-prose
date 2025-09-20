import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: () => import("@/components/views/LandingView.vue"),
        },
        {
            path: "/present",
            component: () => import("@/components/views/PresentView.vue"),
        },
        {
            path: "/past",
            strict: true,
            component: () => import("@/components/views/PastView.vue"),
        },
        {
            path: "/past/:bookId",
            component: () => import("@/components/views/BookDetailView.vue"),
        },
        {
            path: "/future",
            component: () => import("@/components/views/FutureView.vue"),
        },
        {
            path: "/profile",
            strict: true,
            component: () => import("@/components/views/ProfileView.vue"),
        },
    ],
});

export default router;
