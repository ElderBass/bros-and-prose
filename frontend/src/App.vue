<template>
    <ErrorBoundaryView />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { getUserFromStorage } from "./utils";
import { useUIStore } from "./stores/ui";
import { useUser } from "./composables/useUser";
import { useUserStore } from "./stores/user";
import { useBooks } from "./composables/useBooks";
import ErrorBoundaryView from "./components/views/ErrorBoundaryView.vue";
import { useLog } from "./composables/useLog";

const router = useRouter();
const { cleanup: cleanupUIListeners, initializeScreenSize } = useUIStore();
const { getPastBooks } = useBooks();
const { getUser, getUsers } = useUser();

onMounted(async () => {
    try {
        await useLog().info("Initializing app");
        initializeScreenSize();
        await getPastBooks();
        await getUsers();

        const userFromStorage = getUserFromStorage();
        if (!userFromStorage) {
            router.push("/");
        } else {
            const user = await getUser(userFromStorage.id);
            useUserStore().setLoggedInUser(user);
        }
    } catch (error) {
        console.error("Error initializing app:", error);
        await useLog().error(`Error initializing app: ${error}`);
    }
});

onUnmounted(() => {
    cleanupUIListeners();
});
</script>

<style>
:root {
    /* Base colors */
    --background-color: #121212;
    --surface-color: #1e1e2f;
    --main-text: #f5f5f5;

    /* Neon accents */
    --accent-blue: #00bfff; /* light neon blue */
    --accent-lavender: #b388ff; /* neon lavender */
    --accent-green: #39ff14; /* neon green */
    --accent-fuschia: #ff4dff; /* hot pink-fuschia */
    --accent-red: #ff0000; /* hot pink-fuschia */
    --slate-gray: #808080; /* slate gray */
}

body {
    background-color: var(--background-color);
    color: var(--main-text);
    font-family: "Crimson Text", serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    scroll-behavior: smooth;
}

h1,
h2,
h3 {
    font-family: "Libre Baskerville", serif;
}

header {
    line-height: 1.5;
    max-height: 100vh;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

.router-link-wrapper {
    text-decoration: none;
    color: inherit;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

        padding: 1rem 0;
        margin-top: 1rem;
    }
}
</style>
