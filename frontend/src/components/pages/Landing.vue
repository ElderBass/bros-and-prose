<template>
    <div id="landing">
        <div v-if="isLoading">
            <LoadingSpinner
                size="large"
                message="authenticating your divine essence..."
            />
        </div>
        <form @submit.prevent="handleLogin" v-else>
            <h1>which bro are you bro</h1>
            <BaseInput
                id="email"
                v-model="email"
                label="sexxxy email"
                placeholder="sexxxy email"
                type="email"
                :disabled="false"
                prepend-inner-icon="mdi-email"
            />
            <BaseInput
                v-model="password"
                label="studly password"
                placeholder="studly password"
                type="password"
                :disabled="false"
                prepend-inner-icon="mdi-lock"
            />
            <BaseButton
                :title="buttonTitle"
                type="submit"
                variant="primary"
                size="large"
                :disabled="buttonDisabled"
            >
                <span>Initiate God's Plan</span>
            </BaseButton>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const email = ref("");
const password = ref("");
const isLoading = ref(false);

const handleLogin = () => {
    // Need an API call to Firebase to log the user in
    console.log("Login");
    isLoading.value = true;
    setTimeout(() => {
        isLoading.value = false;
    }, 10000);
};

const buttonDisabled = computed(() => {
    return email.value === "" || password.value === "";
});

const buttonTitle = computed(() => {
    return buttonDisabled.value
        ? "fill out the form first you dumb fuck"
        : "let's fuck shit up";
});
</script>

<style scoped>
#landing {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: var(--background-color);
    color: var(--main-text);
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 1rem;
    width: 100%;
}

h1 {
    text-align: center;
    font-size: 1.75rem;
}

v-text-field {
    width: 100%;
}

v-btn {
    width: 100%;
}

@media (min-width: 1024px) {
    form {
        width: 40%;
        padding: 0;
    }
}

@media (min-width: 1024px) {
    h1 {
        font-size: 2rem;
    }
}
</style>
