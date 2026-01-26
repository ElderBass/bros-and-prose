import { useUserStore } from "@/stores/user";
import { useUIStore } from "@/stores/ui";
import { uploadAvatarImage, updateUserAvatarIcon } from "@/services/avatar";
import { validateAvatarFile } from "@/utils/avatarValidation";
import { useLog } from "./useLog";

export const useAvatar = () => {
    const { setLoggedInUser } = useUserStore();
    const { showAlert } = useUIStore();
    const { error: logError } = useLog();

    /**
     * Upload a custom avatar image
     */
    const uploadAvatar = async (userId: string, file: File): Promise<void> => {
        try {
            // Validate file
            const validation = validateAvatarFile(file);
            if (!validation.valid) {
                showAlert({
                    show: true,
                    type: "error",
                    messages: ["avatar upload failed", validation.error || ""],
                    duration: 4000,
                    dismissable: true,
                });
                return;
            }

            // Upload to backend
            const { avatarUrl, user } = await uploadAvatarImage(userId, file);

            console.log(
                "KERTWANGING INCOMING avatarUrl in uploadAvatar",
                avatarUrl
            );
            console.log("KERTWANGING INCOMING user in uploadAvatar", user);

            // Update user store
            setLoggedInUser(user);

            showAlert({
                show: true,
                type: "success",
                messages: ["avatar updated!", "looking good, bro"],
                duration: 3000,
                dismissable: false,
            });
        } catch (error) {
            console.error("Error uploading avatar:", error);
            await logError(`Error uploading avatar: ${error}`);
            showAlert({
                show: true,
                type: "error",
                messages: [
                    "avatar upload failed",
                    (error as Error).message || "unknown error",
                ],
                duration: 5000,
                dismissable: true,
            });
            throw error;
        }
    };

    /**
     * Set an icon avatar
     */
    const setIconAvatar = async (
        userId: string,
        iconName: string
    ): Promise<void> => {
        try {
            const updatedUser = await updateUserAvatarIcon(userId, iconName);
            setLoggedInUser(updatedUser);

            showAlert({
                show: true,
                type: "success",
                messages: ["avatar updated!", "new vibe unlocked"],
                duration: 3000,
                dismissable: false,
            });
        } catch (error) {
            console.error("Error updating avatar:", error);
            await logError(`Error updating avatar: ${error}`);
            showAlert({
                show: true,
                type: "error",
                messages: [
                    "avatar update failed",
                    (error as Error).message || "unknown error",
                ],
                duration: 5000,
                dismissable: true,
            });
            throw error;
        }
    };

    return { uploadAvatar, setIconAvatar };
};
