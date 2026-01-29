import sharp from "sharp";
import { storage, STORAGE_BUCKET } from "../db/index.js";
import { v4 as uuid } from "uuid";

const AVATAR_SIZE = 500; // Max dimensions for avatar
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];
const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

/**
 * Validate uploaded avatar file
 */
export const validateAvatarFile = (
    fileBuffer: Buffer,
    mimeType: string
): { valid: boolean; error?: string } => {
    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        return {
            valid: false,
            error: "Invalid file type. Only JPG and PNG are allowed.",
        };
    }

    // Check file size
    if (fileBuffer.length > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
        };
    }

    return { valid: true };
};

/**
 * Process and optimize avatar image
 */
export const processAvatarImage = async (fileBuffer: Buffer): Promise<Buffer> => {
    try {
        // Resize, optimize, and convert to JPEG
        const processed = await sharp(fileBuffer)
            .resize(AVATAR_SIZE, AVATAR_SIZE, {
                fit: "cover",
                position: "center",
            })
            .jpeg({ quality: 90, progressive: true })
            .toBuffer();

        return processed;
    } catch (error) {
        console.error("Error processing avatar image:", error);
        throw new Error("Failed to process image");
    }
};

/**
 * Upload avatar to Firebase Storage
 */
export const uploadAvatar = async (
    userId = "",
    fileBuffer: Buffer,
    mimeType: string
): Promise<string> => {
    try {
        // Validate file
        const validation = validateAvatarFile(fileBuffer, mimeType);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        if (!userId) {
            throw new Error("User ID is required for avatar upload");
        }

        // Process image
        const processedBuffer = await processAvatarImage(fileBuffer);

        // Generate unique filename
        const fileName = `${userId}-avatar-${uuid()}.jpg`;
        const filePath = `avatars/${userId}/${fileName}`;

        // Get storage bucket
        const bucket = storage.bucket(STORAGE_BUCKET);
        
        const file = bucket.file(filePath);

        // Upload to Firebase Storage
        await file.save(processedBuffer, {
            metadata: {
                contentType: "image/jpeg",
                metadata: {
                    userId,
                    uploadedAt: new Date().toISOString(),
                },
            },
            public: true, // Make publicly accessible
        });

        // Get public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

        return publicUrl;
    } catch (error) {
        console.error("Error uploading avatar:", error);
        throw error;
    }
};

/**
 * Delete user's avatar from Firebase Storage
 */
export const deleteAvatar = async (userId = ""): Promise<void> => {
    try {
        if (!userId) {
            console.warn("No userId provided for avatar deletion");
            return;
        }

        const bucket = storage.bucket(STORAGE_BUCKET);

        const getFilesResponse = await bucket.getFiles({
            prefix: `avatars/${userId}/`,
        });

        const files = getFilesResponse[0];

        if (files.length === 0) {
            console.log(`No existing avatars found for user ${userId}`);
            return;
        }

        // Delete all avatar files for this user
        const deletePromises = files.map((file) => file.delete());
        await Promise.all(deletePromises);

        console.log(`Deleted ${files.length} avatar(s) for user ${userId}`);
    } catch (error: any) {
        // Don't throw if bucket doesn't exist - it's fine on first upload
        if (error.code === 404) {
            console.warn(`Storage bucket doesn't exist yet - skipping deletion for user ${userId}`);
            return;
        }
        // For other errors, just log and continue (don't block upload)
        console.error("Error deleting avatar:", error);
    }
};
