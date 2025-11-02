<template>
    <div id="landing">
        <LoadingSpinner
            v-if="isLoading"
            size="large"
            message="authenticating your divine essence..."
        />
        <FadeIn>
            <SignupSuccessCard
                v-if="showSuccessModal"
                @proceed-click="onSuccessModalClick"
            />
        </FadeIn>
        <LandingViewForm v-if="!showSuccessModal && !isLoading" />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import router from "@/router";
import LandingViewForm from "@/components/form/LandingViewForm.vue";
import SignupSuccessCard from "@/components/form/SignupSuccessCard.vue";
import { useAuth } from "@/composables/useAuth";
import { useUserStore } from "@/stores/user";
import FadeIn from "@/components/transitions/FadeIn.vue";
import { getUserFromStorage } from "@/utils";

const { isLoading } = useAuth();
const userStore = useUserStore();

const showSuccessModal = computed(() => {
    return userStore.loggedInUser.id && !isLoading.value;
});

const onSuccessModalClick = () => router.push("/present");

onMounted(() => {
    if (userStore.loggedInUser.id || getUserFromStorage()?.id) {
        router.push("/present");
    }
});
</script>

<style scoped>
#landing {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: var(--background-color);
    color: var(--main-text);
}
.success-card-container {
    width: 40%;
}

@media (max-width: 768px) {
    .success-card-container {
        width: 90%;
    }
}
</style>
