import { createRouter, createWebHistory } from "vue-router";
import Landing from "@/components/views/LandingView.vue";
import Present from "@/components/views/PresentView.vue";
import Past from "@/components/views/PastView.vue";
import BookDetail from "@/components/views/BookDetailView.vue";
import Future from "@/components/views/FutureView.vue";
import Profile from "@/components/views/ProfileView.vue";

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
