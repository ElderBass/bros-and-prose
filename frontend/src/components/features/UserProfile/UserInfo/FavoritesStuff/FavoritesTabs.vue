<template>
    <TabsContainer
        v-model="activeTab"
        :tabs="favoriteTabs"
        headerTitle="FAVORITES"
        :dynamicHeight="activeTab === 'books'"
    >
        <template #authors>
            <FavoritesTabContent
                type="authors"
                :items="getItemsForTab('authors')"
                :isLoggedInUser="isLoggedInUser"
            />
        </template>

        <template #genres>
            <FavoritesTabContent
                type="genres"
                :items="getItemsForTab('genres')"
                :isLoggedInUser="isLoggedInUser"
            />
        </template>

        <template #books>
            <FavoritesTabContent
                type="books"
                :items="getItemsForTab('books')"
                :isLoggedInUser="isLoggedInUser"
            />
        </template>
        <template #prose>
            <FavoritesTabContent
                type="prose"
                :items="getItemsForTab('prose')"
                :isLoggedInUser="isLoggedInUser"
            />
        </template>
    </TabsContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TabsContainer, {
    type TabConfig,
} from "@/components/ui/TabsContainer.vue";
import FavoritesTabContent from "@/components/features/UserProfile/UserInfo/FavoritesStuff/FavoritesTabContent.vue";
import type { UserFavorites, FavoriteType, ProseEntry } from "@/types";

const { favorites, isLoggedInUser } = defineProps<{
    favorites: UserFavorites | undefined;
    isLoggedInUser: boolean;
}>();

const favoriteTabs: TabConfig[] = [
    { id: "prose", label: "prose by bros", color: "fuschia" },
    { id: "books", label: "books", color: "fuschia" },
    { id: "authors", label: "authors", color: "fuschia" },
    { id: "genres", label: "genres", color: "fuschia" },
];

const activeTab = ref<string>("prose");

const getItemsForTab = (tab: FavoriteType): string[] => {
    if (tab === "books") {
        return (
            Object.values(favorites?.books ?? []).map((book) =>
                JSON.stringify(book)
            ) ?? []
        );
    }
    if (tab === "prose") {
        const proseRaw = favorites?.prose;
        const proseList: ProseEntry[] = Array.isArray(proseRaw)
            ? (proseRaw as ProseEntry[])
            : proseRaw && typeof proseRaw === "object"
              ? (Object.values(proseRaw) as ProseEntry[])
              : [];
        return proseList.map((prose) => JSON.stringify(prose)) ?? [];
    }
    return Object.values(favorites?.[tab] ?? []);
};
</script>
