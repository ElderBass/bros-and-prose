import { ref, readonly } from "vue";
import { useRouter } from "vue-router";
import {
    authService,
    type LoginCredentials,
    type SignupCredentials,
    ApiError,
} from "@/services";
import { useUserStore } from "@/stores/user";

export const useAuth = () => {
    const userStore = useUserStore();
    const router = useRouter();

    const isLoading = ref(false);
    const error = ref("");

    const clearError = () => {
        error.value = "";
    };

    const login = async (credentials: LoginCredentials) => {
        try {
            isLoading.value = true;
            error.value = "";

            const response = await authService.login(credentials);

            if (response.success) {
                userStore.loginUser(response.user);
                router.push("/present");
                return response;
            }
        } catch (err) {
            if (err instanceof ApiError) {
                error.value = err.message;
            } else {
                error.value = "Login failed. Please try again.";
            }
            console.error("Login error:", err);
            throw err;
        } finally {
            setTimeout(() => {
                isLoading.value = false;
            }, 2000);
        }
    };

    const signup = async (credentials: SignupCredentials) => {
        try {
            isLoading.value = true;
            error.value = "";

            const response = await authService.signup(credentials);

            if (response.success) {
                userStore.loginUser(response.user);
                return response;
            }
        } catch (err) {
            if (err instanceof ApiError) {
                error.value = err.message;
            } else {
                error.value = "Signup failed. Please try again.";
            }
            console.error("Signup error:", err);
            throw err;
        } finally {
            setTimeout(() => {
                isLoading.value = false;
            }, 2000);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            userStore.logoutUser();
            router.push("/");
        } catch (err) {
            console.error("Logout error:", err);
            // Still logout locally even if API fails
            userStore.logoutUser();
            router.push("/");
        }
    };

    return {
        isLoading: readonly(isLoading),
        error: readonly(error),
        login,
        signup,
        logout,
        clearError,
    };
};
