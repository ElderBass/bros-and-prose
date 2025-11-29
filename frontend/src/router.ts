import { createRouter, createWebHistory } from "vue-router";
import { beforeEnterProfileView, getUserFromStorage } from "@/utils";

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
            name: "profile-root",
            redirect: () => {
                const user = getUserFromStorage();
                if (user?.username) {
                    return {
                        name: "profile-user",
                        params: { username: user.username },
                    };
                }
                return { path: "/" };
            },
        },
        {
            path: "/profile/:username",
            name: "profile-user",
            component: () => import("@/components/views/ProfileView.vue"),
            props: (route) => ({
                user: route.meta.user,
                isLoggedInUser: route.meta.isLoggedInUser,
            }),
            beforeEnter: async (to, from, next) =>
                await beforeEnterProfileView(to, from, next),
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
