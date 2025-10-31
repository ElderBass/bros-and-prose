<template>
    <BaseCard shadow-color="lavender" size="medium">
        <div class="future-book-item">
            <div class="cover-and-info">
                <img class="cover" :src="book.imageSrc" :alt="book.title" />
                <div class="info">
                    <h3 class="title">{{ book.title }}</h3>
                    <p class="author">{{ book.author }}</p>
                    <p class="meta">{{ book.yearPublished }}</p>
                    <a
                        :href="goodreadsUrl"
                        target="_blank"
                        class="goodreads-link"
                    >
                        peep goodreads
                        <FontAwesomeIcon :icon="faGlasses" />
                    </a>
                    <div class="tags" v-if="book.tags?.length">
                        <BookTag
                            v-for="tag in book.tags"
                            :key="tag"
                            :tag="tag"
                            :selected="true"
                            color="blue"
                            :size="isMobile ? 'small' : 'medium'"
                        />
                    </div>
                </div>
            </div>

            <p class="description">{{ book.description }}</p>

            <div class="footer">
                <VoteCount :voteCount="book.votes.length - 1 || 0" />
                <VoteActions
                    v-if="!userIsFutureBookSelector"
                    :voteCount="book.votes.length - 1 || 0"
                    :userHasVoted="userHasVoted"
                    :handleVote="handleVote"
                />
            </div>
        </div>
    </BaseCard>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { faGlasses } from "@fortawesome/free-solid-svg-icons";
import type { FutureBook } from "@/types";
import { useUserStore } from "@/stores/user";
import BookTag from "@/components/ui/BookTag.vue";
import { useBooks } from "@/composables/useBooks";
import { useUIStore } from "@/stores/ui";
import { useLog } from "@/composables/useLog";
import { QUICK_ERROR, futureBookVotedSuccessAlert } from "@/constants";
import VoteCount from "./VoteCount.vue";
import VoteActions from "./VoteActions.vue";

const { userIsFutureBookSelector, loggedInUser } = useUserStore();
const { showAlert, setIsAppLoading, isMobile } = useUIStore();

const props = defineProps<{
    book: FutureBook;
}>();

const userHasVoted = ref(props.book.votes.includes(loggedInUser.id));

const handleVote = async () => {
    try {
        setIsAppLoading(true);
        await useBooks().voteForFutureBook(props.book.id, loggedInUser.id);
    } catch (error) {
        await useLog().error(`Error voting for future book: ${error}`);
        showAlert(QUICK_ERROR(["voter fraud!", error as string]));
    } finally {
        useUIStore().setIsAppLoading(false);
        showAlert(futureBookVotedSuccessAlert(userHasVoted.value));
    }
};

const goodreadsUrl = computed(() => {
    const q = [props.book.title, props.book.author].filter(Boolean).join(" ");
    return `https://www.goodreads.com/search?q=${encodeURIComponent(q)}`;
});

watch(props.book.votes, (newVotes) => {
    console.log("\n KERTWANGING newVotes", newVotes, "\n\n");
    userHasVoted.value = newVotes.includes(loggedInUser.id);
});
</script>

<style scoped>
.future-book-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    gap: 1rem;
}

.cover-and-info {
    display: flex;
    gap: 1rem;
}

.cover {
    flex: 1 0 40%;
    min-width: 100px;
    max-height: 242px;
    object-fit: cover;
    border-radius: 0.5rem;
}

.info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 1.25rem;
}

.title {
    margin: 0;
    color: var(--accent-fuschia);
    font-style: italic;
    font-family: "Libre Baskerville", serif;
}

.author,
.meta {
    margin: 0;
    opacity: 0.85;
}

.goodreads-link {
    color: var(--accent-lavender);
    text-decoration: underline;
    margin: 0.25rem 0;
}

.goodreads-link:hover {
    color: var(--accent-fuschia);
}

.goodreads-link:hover .fa-glasses {
    color: var(--accent-fuschia);
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
}

.description {
    margin: 0;
    opacity: 0.9;
    border-top: 2px solid var(--accent-blue);
    border-left: 2px solid var(--accent-blue);
    border-top-left-radius: 1rem;
    padding: 0.5rem;
    margin-top: 0.5rem;
    font-size: 1.125rem;
}

.footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

@media (max-width: 768px) {
    .future-book-item {
        gap: 0.5rem;
    }

    .cover-and-info {
        gap: 0.5rem;
    }

    .cover {
        width: 64px;
        min-width: 64px;
    }

    .info {
        font-size: 1rem;
    }

    .goodreads-link {
        font-size: 0.95rem;
    }

    .tags {
        transform: scale(0.9);
        transform-origin: top left;
        gap: 0.125rem;
    }

    .description {
        font-size: 1rem;
        padding: 0.375rem;
        margin-top: 0.375rem;
    }

    .vote-button {
        font-size: 0.9rem;
        padding: 0.25rem 0.5rem;
    }
}
</style>
