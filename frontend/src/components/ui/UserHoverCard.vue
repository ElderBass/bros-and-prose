<template>
    <article class="user-hover-card" @click.stop>
        <header class="card-header">
            <AvatarImage
                :avatar="user.avatar"
                :avatarType="user.avatarType || 'icon'"
                size="small"
            />
            <div class="identity">
                <p class="eyebrow">bro stats</p>
                <h3>@{{ user.username }}</h3>
                <p class="full-name">{{ fullName }}</p>
            </div>
        </header>

        <dl class="stats-grid">
            <div v-for="stat in stats" :key="stat.label" class="stat-card">
                <dt>{{ stat.label }}</dt>
                <dd>{{ stat.value }}</dd>
            </div>
        </dl>

        <RouterLink
            class="profile-link router-link-wrapper"
            :to="`/bros/${user.username}`"
        >
            view profile
        </RouterLink>
    </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import AvatarImage from "./AvatarImage.vue";
import { useProseStore } from "@/stores/prose";
import type { User } from "@/types";
import { getUserShelves } from "@/utils";

const props = defineProps<{
    user: User;
}>();

const { entries: proseEntries } = storeToRefs(useProseStore());

const fullName = computed(() =>
    [props.user.firstName, props.user.lastName].filter(Boolean).join(" ")
);

const shelves = computed(() => getUserShelves(props.user));
const reviews = computed(() => Object.values(props.user.reviews || {}));
const userProseEntries = computed(() =>
    proseEntries.value.filter(
        (entry) => entry.userInfo?.username === props.user.username
    )
);

const averageReviewScore = computed(() => {
    const ratings = reviews.value
        .map((review) => review.rating)
        .filter((rating) => typeof rating === "number");

    if (ratings.length === 0) return "no scores yet";

    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    return (total / ratings.length).toFixed(1);
});

const stats = computed(() => [
    {
        label: "books read",
        value: shelves.value.haveRead.length.toString(),
    },
    {
        label: "reviews left",
        value: reviews.value.length.toString(),
    },
    {
        label: "avg rev score",
        value: averageReviewScore.value,
    },
    {
        label: "prose penned",
        value: userProseEntries.value.length.toString(),
    },
]);
</script>

<style scoped>
.user-hover-card {
    width: min(88vw, 20rem);
    padding: 0.85rem;
    background:
        linear-gradient(
            135deg,
            color-mix(in srgb, var(--accent-blue) 10%, transparent),
            transparent 45%
        ),
        var(--surface-color);
    border: 1px solid
        color-mix(in srgb, var(--accent-lavender) 45%, transparent);
    border-radius: 0.85rem;
    box-shadow:
        0 12px 32px rgba(0, 0, 0, 0.38),
        0 0 0 1px rgba(255, 255, 255, 0.04);
    color: var(--main-text);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.identity {
    min-width: 0;
}

.identity h3,
.identity p {
    margin: 0;
}

.identity h3 {
    color: var(--accent-fuschia);
    font-size: 1.2rem;
    line-height: 1.1;
}

.eyebrow {
    color: var(--accent-lavender);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    line-height: 1.2;
    text-transform: lowercase;
}

.full-name {
    margin-top: 0.1rem;
    font-size: 0.9rem;
    opacity: 0.78;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.45rem;
    margin: 0.75rem 0;
}

.stat-card {
    padding: 0.5rem 0.55rem;
    background: rgba(255, 255, 255, 0.035);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 0.6rem;
}

.stat-card dt {
    color: var(--accent-blue);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    line-height: 1.2;
    text-transform: lowercase;
}

.stat-card dd {
    margin: 0.15rem 0 0;
    color: var(--main-text);
    font-size: 1.15rem;
    font-weight: 700;
    line-height: 1.1;
}

.profile-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.55rem 0.75rem;
    border: 1px solid var(--accent-fuschia);
    border-radius: 999px;
    color: var(--accent-fuschia);
    font-weight: 700;
    transition:
        background-color 0.2s ease,
        color 0.2s ease,
        border-color 0.2s ease;
}

.profile-link:hover {
    background-color: var(--accent-fuschia);
    border-color: var(--accent-fuschia);
    color: var(--background-color);
}
</style>
