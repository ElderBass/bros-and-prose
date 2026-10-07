<template>
    <TransitionGroup name="chip" tag="ul" class="future-book-voters">
        <li key="vote-pill">
            <button
                v-if="showVoteAction"
                type="button"
                class="vote-pill"
                :class="{ voted: userHasVoted, pending: isVoting }"
                :disabled="isVoting"
                :aria-pressed="userHasVoted"
                :title="
                    userHasVoted
                        ? 'unvote for this book'
                        : 'vote for this book to be read next'
                "
                @click="handleVote"
            >
                <span class="pill-label">
                    <FontAwesomeIcon
                        v-if="isVoting"
                        :icon="faCircleNotch"
                        spin
                    />
                    <template v-else-if="userHasVoted">
                        <span class="label-default">
                            <FontAwesomeIcon :icon="faCheck" /> voted
                        </span>
                        <span class="label-hover">
                            <FontAwesomeIcon :icon="faXmark" /> unvote
                        </span>
                    </template>
                    <span v-else>
                        <FontAwesomeIcon :icon="faBookMedical" /> vote
                    </span>
                </span>
                <span class="pill-count">
                    <Transition name="count-bump" mode="out-in">
                        <span :key="voters.length">{{ voters.length }}</span>
                    </Transition>
                </span>
            </button>
            <span v-else class="vote-pill read-only">
                <Transition name="count-bump" mode="out-in">
                    <span :key="voters.length" class="read-only-count">
                        {{ voters.length }}
                    </span>
                </Transition>
                {{ voters.length === 1 ? "vote" : "votes" }}
            </span>
        </li>
        <li
            v-for="voter in visibleVoters"
            :key="voter.id"
            class="voter-chip"
            :class="{ 'is-you': voter.id === loggedInUser.id }"
        >
            <AvatarImage
                :avatar="voter.avatar"
                :avatarType="voter.avatarType || 'icon'"
                size="xsmall"
            />
            <UsernameLink :username="voter.username" fontSize="small" />
            <span v-if="voter.id === loggedInUser.id" class="you-badge">
                you
            </span>
        </li>
        <li v-if="hiddenCount > 0" key="more">
            <button
                type="button"
                class="voter-chip overflow-chip"
                @click="expanded = true"
            >
                +{{ hiddenCount }}
            </button>
        </li>
        <li v-else-if="expanded" key="less">
            <button
                type="button"
                class="voter-chip overflow-chip"
                @click="expanded = false"
            >
                less
            </button>
        </li>
        <li v-if="!voters.length" key="empty" class="no-votes">
            {{ showVoteAction ? "be the first bro." : "no votes yet" }}
        </li>
    </TransitionGroup>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import {
    faBookMedical,
    faCheck,
    faCircleNotch,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import UsernameLink from "@/components/ui/UsernameLink.vue";
import { useUserStore } from "@/stores/user";

const MAX_VISIBLE_CHIPS = 6;

const props = defineProps<{
    voterIds: string[];
    showVoteAction: boolean;
    userHasVoted: boolean;
    isVoting: boolean;
    handleVote: () => void;
}>();

const { allUsers, loggedInUser } = storeToRefs(useUserStore());

const expanded = ref(false);

const voters = computed(() => {
    const matched = allUsers.value.filter((user) =>
        props.voterIds.includes(user.id)
    );
    const you = matched.filter((user) => user.id === loggedInUser.value.id);
    const others = matched.filter((user) => user.id !== loggedInUser.value.id);
    return [...you, ...others];
});

const isCollapsed = computed(
    () => !expanded.value && voters.value.length > MAX_VISIBLE_CHIPS
);

const visibleVoters = computed(() =>
    isCollapsed.value
        ? voters.value.slice(0, MAX_VISIBLE_CHIPS - 1)
        : voters.value
);

const hiddenCount = computed(() =>
    isCollapsed.value ? voters.value.length - visibleVoters.value.length : 0
);
</script>

<style scoped>
.future-book-voters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.375rem;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
}

.vote-pill,
.voter-chip {
    display: inline-flex;
    align-items: center;
    height: 2rem;
    border-radius: 999px;
    line-height: 1;
    white-space: nowrap;
}

/* vote pill */
.vote-pill {
    gap: 0.5rem;
    padding: 0 0.375rem 0 0.875rem;
    border: 1px solid var(--accent-green);
    background: transparent;
    color: var(--accent-green);
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition:
        background 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease,
        box-shadow 0.2s ease;
}

.vote-pill:hover:not(:disabled) {
    background: rgba(57, 255, 20, 0.1);
}

.vote-pill.voted {
    background: rgba(57, 255, 20, 0.16);
    box-shadow: 0 0 12px rgba(57, 255, 20, 0.35);
}

.vote-pill.pending {
    cursor: wait;
    opacity: 0.75;
}

.pill-label {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
}

.label-hover {
    display: none;
}

.pill-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 0.375rem;
    border-radius: 999px;
    background: rgba(57, 255, 20, 0.18);
    font-variant-numeric: tabular-nums;
}

.pill-count > span {
    display: inline-block;
}

@media (hover: hover) {
    .vote-pill.voted:hover:not(:disabled) {
        border-color: var(--accent-red);
        color: var(--accent-red);
        background: rgba(255, 77, 77, 0.12);
        box-shadow: 0 0 12px rgba(255, 77, 77, 0.3);
    }

    .vote-pill.voted:hover:not(:disabled) .pill-count {
        background: rgba(255, 77, 77, 0.18);
    }

    .vote-pill.voted:hover:not(:disabled) .label-default {
        display: none;
    }

    .vote-pill.voted:hover:not(:disabled) .label-hover {
        display: inline;
    }
}

.vote-pill.read-only {
    gap: 0.375rem;
    padding: 0 0.875rem;
    border-color: rgba(0, 191, 255, 0.5);
    color: var(--accent-blue);
    cursor: default;
}

.read-only-count {
    display: inline-block;
    font-variant-numeric: tabular-nums;
}

/* voter chips */
.voter-chip {
    gap: 0.375rem;
    padding: 0 0.625rem 0 0.2rem;
    border: 1px solid rgba(0, 191, 255, 0.35);
    background: rgba(0, 191, 255, 0.06);
    font-size: 0.875rem;
    transition:
        border-color 0.2s ease,
        background 0.2s ease;
}

.voter-chip:hover {
    border-color: var(--accent-blue);
    background: rgba(0, 191, 255, 0.12);
}

.voter-chip.is-you {
    border-color: var(--accent-fuschia);
    background: rgba(255, 0, 255, 0.08);
}

.you-badge {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--accent-fuschia);
}

.overflow-chip {
    padding: 0 0.75rem;
    color: var(--accent-blue);
    font-weight: 700;
    cursor: pointer;
}

.no-votes {
    font-style: italic;
    opacity: 0.6;
    font-size: 0.9rem;
    padding-left: 0.25rem;
}

/* transitions */
.chip-enter-active,
.chip-leave-active {
    transition:
        opacity 0.25s ease,
        transform 0.25s ease;
}

.chip-enter-from,
.chip-leave-to {
    opacity: 0;
    transform: scale(0.85);
}

.chip-move {
    transition: transform 0.25s ease;
}

.count-bump-enter-active {
    animation: count-bump 0.3s ease;
}

@keyframes count-bump {
    0% {
        transform: scale(0.6);
        opacity: 0;
    }
    60% {
        transform: scale(1.25);
        opacity: 1;
    }
    100% {
        transform: scale(1);
    }
}

@media (max-width: 768px) {
    .vote-pill {
        font-size: 0.85rem;
    }

    .voter-chip {
        font-size: 0.8rem;
    }

    .no-votes {
        font-size: 0.85rem;
    }
}
</style>
