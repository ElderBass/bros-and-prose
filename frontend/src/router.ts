import { createRouter, createWebHistory } from "vue-router";
import Landing from "@/views/Landing.vue";
import Present from "@/views/Present.vue";
import Past from "@/views/Past.vue";
import BookDetail from "@/views/BookDetail.vue";
import Future from "@/views/Future.vue";
import Profile from "@/views/Profile.vue";

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
