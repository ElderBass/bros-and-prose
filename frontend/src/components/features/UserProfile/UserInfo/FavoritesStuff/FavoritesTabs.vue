<template>
    <TabsContainer
        v-model="activeTab"
        :tabs="favoriteTabs"
        :headerTitle="headerTitle"
        :dynamicHeight="activeTab === 'books' || activeTab === 'prose'"
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
            <ProseFavoritesContent
                type="prose"
                :items="getProseItems(favorites?.prose ?? [])"
                :isLoggedInUser="isLoggedInUser"
            />
        </template>
    </TabsContainer>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import TabsContainer, {
    type TabConfig,
} from "@/components/ui/TabsContainer.vue";
import FavoritesTabContent from "@/components/features/UserProfile/UserInfo/FavoritesStuff/FavoritesTabContent.vue";
import ProseFavoritesContent from "./ProseFavoritesContent.vue";
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

const { mobile } = useDisplay();

const activeTab = ref<string>("prose");

const headerTitle = computed(() => {
    return mobile.value ? "FAVS" : "FAVORITES";
});

const getItemsForTab = (tab: FavoriteType): string[] => {
    if (tab === "books") {
        return (
            Object.values(favorites?.books ?? []).map((book) =>
                JSON.stringify(book)
            ) ?? []
        );
    }

    return Object.values(favorites?.[tab] ?? []);
};

const getProseItems = (proseRaw: string[] | ProseEntry[]): ProseEntry[] => {
    return Array.isArray(proseRaw)
        ? (proseRaw as ProseEntry[])
        : proseRaw && typeof proseRaw === "object"
          ? (Object.values(proseRaw) as ProseEntry[])
          : [];
};
</script>
