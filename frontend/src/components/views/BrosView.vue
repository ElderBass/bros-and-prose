<template>
    <AppLayout>
        <PageTitle title="bros before prose" />
        <LoadingSpinnerContainer
            v-if="isLoading"
            size="large"
            message="loading the bros..."
        />
        <div v-else class="bros-content">
            <div v-if="allUsers.length === 0" class="empty-state">
                <p>no bros found — that's weird...</p>
            </div>
            <div v-else class="bros-list">
                <BroListItem
                    v-for="user in sortedUsers"
                    :key="user.id"
                    :user="user"
                />
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import LoadingSpinnerContainer from "@/components/ui/LoadingSpinnerContainer.vue";
import BroListItem from "@/components/features/Bros/BroListItem.vue";
import { useUserStore } from "@/stores/user";
import { useUser } from "@/composables/useUser";
import { useLog } from "@/composables/useLog";

const { allUsers } = storeToRefs(useUserStore());
const { getUsers } = useUser();
const { error: logError } = useLog();

const isLoading = ref(true);

// Sort users: logged-in user first, then alphabetically by username
const sortedUsers = computed(() => {
    const { loggedInUser } = useUserStore();
    const users = [...allUsers.value];

    return users.sort((a, b) => {
        // Logged-in user always first
        if (a.id === loggedInUser?.id) return -1;
        if (b.id === loggedInUser?.id) return 1;

        // Then sort alphabetically by username
        return a.username.localeCompare(b.username);
    });
});

onMounted(async () => {
    try {
        isLoading.value = true;
        await getUsers();
    } catch (error) {
        console.error("Error loading users:", error);
        await logError(`Error loading users: ${error}`);
    } finally {
        isLoading.value = false;
    }
});
</script>

<style scoped>
.bros-content {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.bros-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    width: 100%;
}

.empty-state {
    padding: 3rem;
    border: 2px dashed var(--accent-blue);
    border-radius: 1rem;
    text-align: center;
    font-size: 1.5rem;
    color: var(--main-text);
    opacity: 0.85;
    font-style: italic;
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );
}

@media (min-width: 768px) {
    .bros-content {
        padding: 3rem 2rem;
    }

    .bros-list {
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
    }
}

@media (max-width: 767px) {
    .bros-content {
        padding: 1.5rem 0.75rem;
    }

    .bros-list {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .empty-state {
        padding: 2rem 1rem;
        font-size: 1.25rem;
    }
}
</style>
