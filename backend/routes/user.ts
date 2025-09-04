import express from "express";
import { db } from "../db/index.ts";

export const getUser = async (req: express.Request, res: express.Response) => {
    const { userId } = req.params;

    try {
        const userRef = db.ref(`users/${userId}`);
        const user = await userRef.once("value");
        return res.json({
            success: true,
            message: "User fetched successfully",
            data: user.val(),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get user",
            error: error,
        });
    }
};

export const getUsers = async (_: express.Request, res: express.Response) => {
    try {
        const usersRef = db.ref("users");
        const users = await usersRef.once("value");
        return res.json({
            success: true,
            message: "Users fetched successfully",
            data: users.val(),
        });
    } catch (error) {
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
        const updatedUser = await userRef.once("value");
        return res.json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: error,
        });
    }
};
