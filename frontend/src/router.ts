import { createRouter, createWebHistory } from "vue-router";
import { beforeEnterBrosView, isGuestUser } from "@/utils";
import { useUserStore } from "./stores/user";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "landing",
            component: () => import("@/components/views/LandingView.vue"),
        },
        {
            path: "/present",
            name: "present",
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
            name: "profile-root",
            component: () => import("@/components/views/UserProfileView.vue"),
            beforeEnter: (to, from, next) => {
                if (isGuestUser()) {
                    next({ name: "present" });
                } else if (!useUserStore().loggedInUser.id) {
                    next({ name: "landing" });
                } else {
                    next();
                }
            },
        },
        {
            path: "/bros",
            component: () => import("@/components/views/BrosView.vue"),
        },
        {
            path: "/bros/:username",
            name: "bro-user",
            component: () =>
                import("@/components/views/OtherBroProfileView.vue"),
            props: (route) => ({
                user: route.meta.user,
            }),
            beforeEnter: async (to, from, next) =>
                await beforeEnterBrosView(to, from, next),
        },
        {
            path: "/palaver",
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
