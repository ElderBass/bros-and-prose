<template>
    <form @submit.prevent="handleSignup">
        <div class="header-container">
            <h1>welcome to bros and prose</h1>
        </div>
        <BroSelect v-model="broName" />
        <div class="form-container-wrapper">
            <transition name="slide-in">
                <div v-if="isSignup" class="form-container">
                    <h3>register once, then never again</h3>
                    <div class="inputField">
                        <h4 class="inputFieldLabel">yada yada etc. so forth</h4>
                        <BaseInput
                            id="email"
                            v-model="email"
                            label="sexxxy email"
                            placeholder="sexxxy email"
                            type="email"
                            :disabled="false"
                            prepend-inner-icon="mdi-email"
                        />
                        <div class="spacer" />
                        <BaseInput
                            v-model="password"
                            label="studly password"
                            placeholder="studly password"
                            type="password"
                            :disabled="false"
                        />
                        <div class="spacer" />
                        <BaseInput
                            v-model="confirmPassword"
                            label="this better match"
                            placeholder="this better match..."
                            type="password"
                            :disabled="false"
                        />
                    </div>
                    <div class="passwordMessage">
                        <p
                            v-if="showPasswordError"
                            style="color: var(--accent-red)"
                        >
                            bro the fuck are you doing, match the password...
                        </p>
                        <p
                            v-if="showPasswordMessage"
                            style="color: var(--accent-green)"
                        >
                            wow you're not as dumb as you look...
                        </p>
                    </div>
                    <div class="button-container">
                        <FadeIn>
                            <BaseButton
                                v-if="!buttonDisabled"
                                :title="buttonTitle"
                                type="submit"
                                variant="outline-secondary"
                                size="large"
                                :disabled="buttonDisabled"
                            >
                                <span>initiate god's plan</span>
                            </BaseButton>
                        </FadeIn>
                    </div>
                </div>
            </transition>
            <transition name="slide-in">
                <div v-if="activeForm === 'login'" class="form-container">
                    <div class="inputField">
                        <h4 class="inputFieldLabel">his broness returns...</h4>
                        <BaseInput
                            v-model="password"
                            label="studly password"
                            placeholder="studly password"
                            type="password"
                            :disabled="false"
                        />
                    </div>
                    <div class="button-container">
                        <FadeIn>
                            <BaseButton
                                v-if="!buttonDisabled"
                                :title="buttonTitle"
                                type="submit"
                                variant="outline-secondary"
                                size="large"
                                :disabled="buttonDisabled"
                            >
                                <span>resume god's plan</span>
                            </BaseButton>
                        </FadeIn>
                    </div>
                </div>
            </transition>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BroSelect from "@/components/form/BroSelect.vue";
import { useAuth } from "@/composables/useAuth";
import { useUser } from "@/composables/useUser";
import FadeIn from "../transitions/FadeIn.vue";
import { getIdFromBroName } from "@/utils";

const { signup, login } = useAuth();
const { getUser } = useUser();

const broName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const activeForm = ref("");

watch(broName, async (newVal) => {
    if (newVal) {
        activeForm.value = "";
        const broId = getIdFromBroName(newVal);
        const bro = await getUser(broId);
        if (bro) {
            email.value = bro.email;
            activeForm.value = "login";
        } else {
            email.value = "";
            password.value = "";
            confirmPassword.value = "";
            activeForm.value = "signup";
        }
    }
});

const handleSignup = async () => {
    try {
        const bro = broName.value.split(" ");
        const payload = {
            firstName: bro[0],
            lastName: bro[1],
            email: email.value.trim().toLowerCase(),
            password: password.value.trim(),
        };
        const action = isSignup.value ? signup : login;
        await action(payload);
    } catch (err) {
        console.error(err);
    }
};

const isSignup = computed(() => {
    return activeForm.value === "signup";
});

const buttonDisabled = computed(() => {
    if (
        email.value === "" ||
        password.value === "" ||
        (confirmPassword.value === "" && isSignup.value) ||
        broName.value === ""
    ) {
        return true;
    }

    if (password.value !== confirmPassword.value && isSignup.value) {
        return true;
    }

    return false;
});

const buttonTitle = computed(() => {
    return buttonDisabled.value
        ? "fill out the form first you dumb fuck"
        : "let's fuck shit up";
});

const showPasswordError = computed(() => {
    return (
        password.value.length > 3 &&
        confirmPassword.value.length > 3 &&
        password.value !== confirmPassword.value
    );
});

const showPasswordMessage = computed(() => {
    return (
        password.value.length > 3 &&
        confirmPassword.value.length > 3 &&
        !showPasswordError.value
    );
});
</script>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 1rem;
    width: 100%;
}

.header-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

h1 {
    text-align: center;
    font-size: 1.5rem;
    border-bottom: 2px solid var(--accent-blue);
    padding-bottom: 0.25rem;
    font-family: "Libre Baskerville", serif;
}

.form-container-wrapper {
    height: 100%;
    width: 100%;
    min-height: 400px;
}

.form-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

h3 {
    text-align: center;
    font-size: 1.25rem;
    font-weight: 400;
    font-family: "Libre Baskerville", serif;
}

.selectField {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.inputField {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.inputFieldLabel {
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--accent-fuschia);
    margin-left: 0.5rem;
}

.passwordMessage {
    font-size: 1.25rem;
    font-weight: 400;
    text-align: center;
    padding: 0.25rem;
    height: 2.25rem;
}

.spacer {
    height: 0.25rem;
}

.button-container {
    width: 100%;
    height: 4.5rem;
    display: flex;
    justify-content: center;
}

.slide-in-enter-active,
.slide-in-leave-active {
    transition: all 0.5s ease;
}

.slide-in-enter-from,
.slide-in-leave-to {
    opacity: 0;
    transform: translateY(10px);
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
