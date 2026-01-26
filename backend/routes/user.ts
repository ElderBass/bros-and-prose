import express from "express";
import multer from "multer";
import { db } from "../db/index.js";
import { uploadAvatar, deleteAvatar } from "../services/avatarUpload.js";

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024, // 1MB
    },
});

export const getUser = async (req: express.Request, res: express.Response) => {
    const { userId } = req.params;
    console.log("KERTWANGING INCOMING userId in getUser", userId);
    try {
        const userRef = db.ref(`users/${userId}`);
        const user = await userRef.once("value");
        return res.json({
            success: true,
            message: "User fetched successfully",
            data: user.val(),
        });
    } catch (error) {
        console.log("KERTWANGING ERROR in getUser", error);
        res.status(500).json({
            success: false,
            message: "Failed to get user",
            error: error,
        });
    }
};

export const getUserByUsername = async (req: express.Request, res: express.Response) => {
    const { username } = req.params;
    try {
        const usersRef = db.ref("users");
        const users = await usersRef.once("value");
        const targetUser = Object.values(users.val()).find(
            (user: any) => user.username === username
        );
        console.log("KERTWANGING OUTGOING targetUser in getUserByUsername", targetUser);
        return res.json({
            success: true,
            message: "User fetched successfully",
            data: targetUser,
        });
    } catch (error) {
        console.log("KERTWANGING ERROR in getUserByUsername", error);
        res.status(500).json({
            success: false,
            message: "Failed to get user by username",
            error: error,
        });
    }
};

export const getUsers = async (_: express.Request, res: express.Response) => {
    try {
        const usersRef = db.ref("users");
        const users = await usersRef.once("value");
        const usersArray = Object.values(users.val());
        return res.json({
            success: true,
            message: "Users fetched successfully",
            data: usersArray,
        });
    } catch (error) {
        console.log("KERTWANGING ERROR in getUsers", error);
        res.status(500).json({
            success: false,
            message: "Failed to get users",
            error: error,
        });
    }
};

export const updateUser = async (req: express.Request, res: express.Response) => {
    const { userId } = req.params;
    try {
        const userRef = db.ref(`users/${userId}`);
        await userRef.update(req.body);
        console.log("KERTWANGING OUTGOING req.body in updateUser", req.body);
        const updatedUser = await userRef.once("value");
        return res.json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.log("KERTWANGING ERROR in updateUser", error);
        res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: error,
        });
    }
};

export const uploadUserAvatar = [
    upload.single("avatar"),
    async (req: express.Request, res: express.Response) => {
        const { userId } = req.params;

        console.log(
            "KERTWANGING INCOMING userId in uploadUserAvatar",
            userId,
            "and req.file",
            req.file?.filename
        );

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        try {
            // Delete old avatar first
            await deleteAvatar(userId);

            // Upload to Firebase Storage
            const avatarUrl = await uploadAvatar(userId, req.file.buffer, req.file.mimetype);

            const userRef = db.ref(`users/${userId}`);

            // Update user record with new avatar
            await userRef.update({
                avatar: avatarUrl,
                avatarType: "image",
            });

            const updatedUser = await db.ref(`users/${userId}`).once("value");

            return res.json({
                success: true,
                message: "Avatar uploaded successfully",
                data: {
                    avatarUrl,
                    user: updatedUser.val(),
                },
            });
        } catch (error: any) {
            console.error("Error uploading avatar:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to upload avatar",
                error: error,
            });
        }
    },
];
