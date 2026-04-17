<template>
    <ErrorBoundaryView />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import ErrorBoundaryView from "./components/views/ErrorBoundaryView.vue";
import { initApp } from "./setup";

/** Full reload after this long with no throttled activity while tab is visible */
const IDLE_RELOAD_MS = 15 * 60 * 1000;
/** Full reload when tab becomes visible again after this long continuously hidden */
const BACKGROUND_RELOAD_MS = 5 * 60 * 1000;
/** Avoid resetting the idle timer on every scroll/wheel tick */
const ACTIVITY_THROTTLE_MS = 1000;

const ACTIVITY_EVENTS = ["pointerdown", "keydown", "wheel", "scroll"] as const;

const activityListenerOpts: AddEventListenerOptions = {
    capture: true,
    passive: true,
};

let idleTimerId: ReturnType<typeof setTimeout> | undefined;
let lastActivityThrottleAt = 0;
/** Set when document becomes hidden; cleared after handling visible */
let hiddenAtMs: number | undefined;

function clearIdleTimer() {
    if (idleTimerId !== undefined) {
        clearTimeout(idleTimerId);
        idleTimerId = undefined;
    }
}

function scheduleIdleReload() {
    clearIdleTimer();
    idleTimerId = window.setTimeout(() => {
        window.location.reload();
    }, IDLE_RELOAD_MS);
}

function onUserActivity() {
    const now = Date.now();
    if (now - lastActivityThrottleAt < ACTIVITY_THROTTLE_MS) return;
    lastActivityThrottleAt = now;
    scheduleIdleReload();
}

function onVisibilityChange() {
    if (document.visibilityState === "hidden") {
        clearIdleTimer();
        hiddenAtMs = Date.now();
    } else {
        if (
            hiddenAtMs !== undefined &&
            Date.now() - hiddenAtMs >= BACKGROUND_RELOAD_MS
        ) {
            window.location.reload();
            return;
        }
        hiddenAtMs = undefined;
        scheduleIdleReload();
    }
}

function onOnline() {
    scheduleIdleReload();
}

onMounted(async () => {
    await initApp();
    scheduleIdleReload();

    for (const type of ACTIVITY_EVENTS) {
        document.addEventListener(type, onUserActivity, activityListenerOpts);
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("online", onOnline);
});

onUnmounted(() => {
    clearIdleTimer();
    for (const type of ACTIVITY_EVENTS) {
        document.removeEventListener(
            type,
            onUserActivity,
            activityListenerOpts
        );
    }
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("online", onOnline);
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
    --accent-yellow: #ffff00; /* neon yellow */
    --accent-red: #ff0000; /* hot pink-fuschia */
    --accent-pink: #ff6ec7; /* lighter neon pink */
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
