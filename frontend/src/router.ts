import { createRouter, createWebHistory } from "vue-router";
import Landing from "@/views/LandingView.vue";
import Present from "@/views/PresentView.vue";
import Past from "@/views/PastView.vue";
import BookDetail from "@/views/BookDetailView.vue";
import Future from "@/views/FutureView.vue";
import Profile from "@/views/ProfileView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: () => Landing },
        { path: "/present", component: () => Present },
        { path: "/past", component: () => Past },
        { path: "/past/:bookId", component: () => BookDetail },
        { path: "/future", component: () => Future },
        { path: "/profile", component: () => Profile },
    ],
});

export default router;
