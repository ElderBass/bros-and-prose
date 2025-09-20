<template>
    <AppLayout>
        <PageTitle title="check urself / wreck urself" />
        <div class="profile-content">
            <UserInfoCard />
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "../ui/PageTitle.vue";
import UserInfoCard from "../features/UserProfile/UserInfoCard.vue";
</script>

<style scoped>
.profile-content {
    height: 50%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 2rem;
}
</style>
