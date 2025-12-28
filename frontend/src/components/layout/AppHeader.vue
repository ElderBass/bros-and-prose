<template>
    <header>
        <LogoButton :handleClick="goToPresent" />

        <!-- Desktop Navigation -->
        <div v-if="!mobile" class="nav-links desktop-nav">
            <RouterLink
                v-for="link in getMainLinks()"
                :key="link.path"
                :class="{
                    'router-link-active': activeLink.includes(link.label),
                }"
                :to="link.path"
            >
                {{ link.label }}
            </RouterLink>
            <div class="link-separator">|</div>
            <RouterLink
                v-for="link in getOtherLinks()"
                :key="link.path"
                :class="{
                    'router-link-active': activeLink.includes(link.label),
                }"
                :to="link.path"
            >
                {{ link.label }}
                <NotificationDot
                    v-if="link.path === '/palaver' && hasUnreadEntries"
                />
            </RouterLink>
        </div>
        <RouterLink
            v-if="!mobile && currentAvatar && !isGuest"
            class="router-link-wrapper"
            to="/profile"
        >
            <ProfileButton
                :handleClick="() => {}"
                :currentAvatar="currentAvatar"
            />
        </RouterLink>
        <RouterLink v-if="isGuest && !mobile" class="login-link" to="/">
            login
        </RouterLink>

        <button
            v-if="mobile"
            class="hamburger mobile-nav"
            @click="toggleMobileMenu"
            :class="{ active: isMobileMenuOpen }"
        >
            <span></span>
            <span></span>
            <span></span>
        </button>

        <!-- Mobile Menu Overlay -->
        <div
            v-if="mobile"
            class="mobile-menu"
            :class="{ active: isMobileMenuOpen }"
        >
            <div class="mobile-nav-links">
                <RouterLink
                    v-for="link in getMobileLinks()"
                    :key="link.path"
                    :class="{
                        'router-link-active': link.path.includes(activeLink),
                    }"
                    :to="link.path"
                    @click="closeMobileMenu"
                >
                    {{ link.label }}
                    <NotificationDot
                        v-if="link.path === '/palaver' && hasUnreadEntries"
                    />
                </RouterLink>
                <RouterLink
                    v-if="currentAvatar && !isGuest"
                    to="/profile"
                    class="mobile-profile-btn"
                    style="color: var(--accent-blue)"
                    @click="closeMobileMenu"
                >
                    <FontAwesomeIcon :icon="currentAvatar" />
                    <span>Profile</span>
                </RouterLink>
                <RouterLink
                    v-if="isGuest"
                    class="login-link"
                    to="/"
                    @click="closeMobileMenu"
                >
                    login
                </RouterLink>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import router from "@/router";
import LogoButton from "@/components/layout/LogoButton.vue";
import ProfileButton from "@/components/layout/ProfileButton.vue";
import NotificationDot from "../ui/NotificationDot.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { AVATAR_ICON_LIST } from "@/constants";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    isGuestUser,
    getMainLinks,
    getOtherLinks,
    getMobileLinks,
} from "@/utils";
import { usePalaverStore } from "@/stores/palaver";

const route = useRoute();
const { mobile } = useDisplay();

const isMobileMenuOpen = ref(false);
const { loggedInUser } = storeToRefs(useUserStore());
const { hasUnreadEntries } = storeToRefs(usePalaverStore());

const currentAvatar = ref<IconDefinition | null>(null);

const isGuest = computed(() => {
    return isGuestUser() || loggedInUser.value.id === "guest";
});

watch(
    () => loggedInUser.value.avatar,
    (newAvatar) => {
        currentAvatar.value =
            AVATAR_ICON_LIST.find((icon) => icon.iconName === newAvatar) ??
            null;
    }
);

const activeLink = computed(() => {
    return route.path;
});

const goToPresent = async () => {
    await router.push("/present");
};

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
};

onMounted(() => {
    currentAvatar.value =
        AVATAR_ICON_LIST.find(
            (icon) => icon.iconName === loggedInUser.value.avatar
        ) ?? null;
});
</script>

<style scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1rem 1.25rem;
    background-color: var(--background-color);
    color: var(--accent-blue);
    font-size: 1.5rem;
    position: relative;
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
    position: relative; /* anchor for notif dot */
}

.nav-links a:hover {
    color: var(--accent-blue);
}

.nav-links a.router-link-active {
    border-bottom: 2px solid var(--accent-blue);
}

.login-link {
    color: var(--accent-blue);
    text-decoration: none;
    font-size: 1.5rem;
    transition: color 0.3s ease;
}

.login-link:hover {
    color: var(--accent-lavender);
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
    position: relative; /* anchor for notif dot */
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
    .mobile-nav {
        display: flex;
    }

    header {
        padding: 0.75rem 1rem;
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
