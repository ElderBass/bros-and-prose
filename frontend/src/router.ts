import { createRouter, createWebHistory } from "vue-router";
import Landing from "./components/pages/Landing.vue";
import HomeView from "./views/HomeView.vue";
// import HomeBase from "./components/pages/HomeBase.vue";
// import AboutMe from "./components/pages/AboutMe.vue";
// import PingMe from "./components/pages/PingMe.vue";
// import VariousProlixities from "./components/pages/VariousProlixities.vue";

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: "/", component: Landing, },
		{ path: "/home", component: HomeView },
		// { path: "/ping-me", component: PingMe },
		// { path: "/prolixities", component: VariousProlixities },
	],
});

export default router;
