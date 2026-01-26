const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validate avatar file on client side
 */
export const validateAvatarFile = (file: File): ValidationResult => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `file too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`,
        };
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: "only JPG and PNG allowed",
        };
    }

    return { valid: true };
};

/**
 * Create a preview URL for the selected file
 */
export const createImagePreview = (file: File): string => {
    return URL.createObjectURL(file);
};

/**
 * Revoke a preview URL to free memory
 */
export const revokeImagePreview = (url: string): void => {
    URL.revokeObjectURL(url);
};
