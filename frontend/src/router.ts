import { createRouter, createWebHistory } from "vue-router";
import { IS_PALAVER_ENABLED } from "./constants/palaver";

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
            component: () => import("@/components/views/ProfileView.vue"),
        },
        {
            path: "/palaver",
            beforeEnter: (to, from, next) => {
                if (IS_PALAVER_ENABLED) {
                    next();
                } else {
                    next({ name: "four-oh-four" });
                }
            },
            component: () => import("@/components/views/PalaverView.vue"),
        },
        {
            path: "/:pathMatch(.*)*",
            name: "four-oh-four",
            component: () => import("@/components/views/FourOhFourView.vue"),
        },
    ],
});

export default router;
