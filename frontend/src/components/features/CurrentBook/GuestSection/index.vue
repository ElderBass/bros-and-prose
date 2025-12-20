<template>
    <div class="guest-section">
        <SignupSuccessCard />

        <div class="links">
            <SectionLink
                v-for="link in sectionLinks"
                :key="link"
                :type="link"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import SignupSuccessCard from "@/components/form/SignupSuccessCard.vue";
import SectionLink from "./SectionLink.vue";
import type { SectionLinkType } from "./types";

defineOptions({ name: "GuestSection" });

const sectionLinks: SectionLinkType[] = ["past", "bros", "palaver"];
</script>

<style scoped>
.guest-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    justify-content: center;
}

.links {
    width: 100%;
    max-width: 520px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.router-link {
    width: 100%;
    text-decoration: none;
}

@media (max-width: 768px) {
    .guest-section {
        gap: 1rem;
    }

    .links {
        flex-direction: row;
        justify-content: space-between;
        max-width: 100%;
        gap: 0.5rem;
    }
}
</style>
