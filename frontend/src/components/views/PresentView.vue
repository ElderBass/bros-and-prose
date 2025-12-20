<template>
    <AppLayout>
        <div v-if="isLoading" class="spinner-container">
            <LoadingSpinner
                v-if="isLoading"
                size="large"
                message="retrieving the current prose, bros..."
            />
        </div>
        <CurrentBookLayout v-else>
            <template v-slot:current-book>
                <GuestSection v-if="guestMobile" />
                <CurrentBookInfo :book="book" />
            </template>
            <template v-slot:user-progress>
                <div class="discussion-container">
                    <GuestSection v-if="isGuestUser() && !guestMobile" />
                    <UserSection v-else-if="loggedInUser.id" :book="book" />
                    <RouterLink
                        v-if="book.completed"
                        class="router-link-wrapper"
                        :to="`/past/${book.id}`"
                    >
                        <BaseButton
                            title="check what the bros are saying"
                            variant="outline-tertiary"
                            :size="mobile ? 'medium' : 'large'"
                        >
                            <FontAwesomeIcon :icon="faComments" />
                            <span>go to discussion</span>
                        </BaseButton>
                    </RouterLink>
                </div>
            </template>
            <template v-slot:other-bros-progress>
                <OtherBrosProgress :book="book" />
            </template>
        </CurrentBookLayout>
        <PalaverModals />
        <PalaverFab v-if="!isGuestUser()" @click="openItemModal('create')" />
    </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import AppLayout from "@/components/layout/AppLayout.vue";
import CurrentBookLayout from "@/components/layout/CurrentBookLayout.vue";
import CurrentBookInfo from "@/components/features/CurrentBook/CurrentBookInfo.vue";
import UserSection from "@/components/features/CurrentBook/UserSection.vue";
import GuestSection from "@/components/features/CurrentBook/GuestSection/index.vue";
import OtherBrosProgress from "@/components/features/CurrentBook/OtherBrosProgress.vue";
import PalaverFab from "@/components/features/Palaver/PalaverFab.vue";
import PalaverModals from "@/components/modal/PalaverModals/index.vue";
import { useBooks } from "@/composables/useBooks";
import { useBooksStore } from "@/stores/books";
import type { Book } from "@/types";
import { useUserStore } from "@/stores/user";
import { usePalaverStore } from "@/stores/palaver";
import { getUserFromStorage, isGuestUser } from "@/utils";
import { useUser } from "@/composables/useUser";
import { useLog } from "@/composables/useLog";
import { faComments } from "@fortawesome/free-solid-svg-icons";

const { currentBook: storedCurrentBook } = useBooksStore();
const { getCurrentBook } = useBooks();
const { loggedInUser, setLoggedInUser } = useUserStore();
const { getUser } = useUser();
const { openItemModal } = usePalaverStore();

const { mobile } = useDisplay();

const isLoading = ref(true);
const book = ref<Book>(storedCurrentBook);

const guestMobile = computed(() => isGuestUser() && mobile.value);

watch(storedCurrentBook, (newBook) => {
    book.value = newBook;
});

onMounted(async () => {
    try {
        if (!book.value.id) {
            isLoading.value = true;
            const currentBook = await getCurrentBook();
            book.value = currentBook;
        }
        if (getUserFromStorage()?.id && !loggedInUser.id) {
            const user = await getUser(getUserFromStorage().id);
            setLoggedInUser(user);
        }
    } catch (error) {
        console.error("Error fetching current book", error);
        await useLog().error(`Error fetching current book: ${error}`);
    } finally {
        isLoading.value = false;
    }
});
</script>

<style scoped>
.present-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0 1rem;
}

.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.discussion-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    width: 100%;
}
</style>
