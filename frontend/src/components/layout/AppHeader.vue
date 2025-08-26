<template>
    <header>
        <button class="logo" @click="router.push('/present')">
            <FontAwesomeIcon icon="fa-solid fa-book-open-reader" />
            <h1>b&p</h1>
        </button>

        <!-- Desktop Navigation -->
        <div class="nav-links desktop-nav">
            <RouterLink
                v-for="link in navLinks"
                :key="link.path"
                :class="{ 'router-link-active': activeLink === link.path }"
                :to="link.path"
                >{{ link.label }}</RouterLink
            >
        </div>
        <button
            class="user-actions desktop-nav"
            @click="router.push('/profile')"
        >
            <FontAwesomeIcon icon="fa-solid fa-user-astronaut" />
        </button>

        <!-- Mobile Hamburger Button -->
        <button
            class="hamburger mobile-nav"
            @click="toggleMobileMenu"
            :class="{ active: isMobileMenuOpen }"
        >
            <span></span>
            <span></span>
            <span></span>
        </button>

        <!-- Mobile Menu Overlay -->
        <div class="mobile-menu" :class="{ active: isMobileMenuOpen }">
            <div class="mobile-nav-links">
                <RouterLink
                    v-for="link in navLinks"
                    :key="link.path"
                    :class="{ 'router-link-active': activeLink === link.path }"
                    :to="link.path"
                    @click="closeMobileMenu"
                    >{{ link.label }}</RouterLink
                >
                <button class="mobile-profile-btn" @click="goToProfile">
                    <FontAwesomeIcon icon="fa-solid fa-user-astronaut" />
                    <span>Profile</span>
                </button>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import router from "@/router";

const navLinks = [
    { path: "/present", label: "present" },
    { path: "/past", label: "past" },
    { path: "/future", label: "future" },
];

const isMobileMenuOpen = ref(false);

const activeLink = computed(() => {
    return router.currentRoute.value.path;
});

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
};

const goToProfile = () => {
    router.push("/profile");
    closeMobileMenu();
};
</script>

<style scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1.25rem;
    background-color: var(--background-color);
    color: var(--accent-blue);
    font-size: 1.5rem;
    margin-bottom: 1rem;
    position: relative;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    text-decoration: none;
    z-index: 1001;
    margin: 0;
}

.logo:hover {
    color: var(--accent-fuschia);
    h1 {
        color: var(--accent-fuschia);
    }
}

h1 {
    font-family: "Libre Baskerville", serif;
    font-size: 1.75rem;
    font-weight: 400;
    color: var(--accent-blue);
    text-align: center;
    margin: 0;
    padding: 0;
}

/* Desktop Navigation */
.desktop-nav {
    display: flex;
}

.nav-links {
    gap: 1.5rem;
    font-size: 1.5rem;
}

.nav-links a {
    color: var(--main-text);
    text-decoration: none;
}

.nav-links a:hover {
    color: var(--accent-blue);
}

.nav-links a.router-link-active {
    border-bottom: 2px solid var(--accent-blue);
}

.user-actions {
    padding: 0.75rem;
    border-radius: 50%;
    background-color: var(--background-color);
    border: 2px solid var(--accent-blue);
}

.user-actions:hover {
    background-color: var(--accent-blue);
    color: var(--background-color);
}

/* Mobile Navigation */
.mobile-nav {
    display: none;
}

/* Hamburger Menu */
.hamburger {
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 30px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 1001;
}

.hamburger span {
    width: 30px;
    height: 3px;
    background-color: var(--accent-blue);
    border-radius: 2px;
    transition: all 0.3s ease;
    transform-origin: center;
}

.hamburger.active span:nth-child(1) {
    transform: rotate(45deg) translate(7px, 7px);
}

.hamburger.active span:nth-child(2) {
    opacity: 0;
}

.hamburger.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
}

/* Mobile Menu Overlay */
.mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: var(--background-color);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.mobile-menu.active {
    transform: translateX(0);
}

.mobile-nav-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    font-size: 2rem;
}

.mobile-nav-links a {
    color: var(--main-text);
    text-decoration: none;
    font-size: 2rem;
    transition: color 0.3s ease;
}

.mobile-nav-links a:hover,
.mobile-nav-links a.router-link-active {
    color: var(--accent-blue);
}

.mobile-profile-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: transparent;
    border: 2px solid var(--accent-blue);
    color: var(--accent-blue);
    padding: 1rem 1.5rem;
    border-radius: 1.5rem;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.mobile-profile-btn:hover {
    background-color: var(--accent-blue);
    color: var(--background-color);
}

/* Responsive Breakpoints */
@media (max-width: 768px) {
    .desktop-nav {
        display: none;
    }

    .mobile-nav {
        display: flex;
    }

    header {
        padding: 1rem;
    }

    h1 {
        font-size: 1.5rem;
    }
}

@media (max-width: 480px) {
    header {
        padding: 1rem;
    }

    .mobile-nav-links {
        gap: 2rem;
    }

    .mobile-nav-links a {
        font-size: 1.75rem;
    }
}
</style>
