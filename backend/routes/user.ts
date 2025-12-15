import express from "express";
import { db } from "../db/index.js";

export const getUser = async (req: express.Request, res: express.Response) => {
    const { userId } = req.params;
    console.log("KERTWANGING INCOMING userId in getUser", userId);
    try {
        const userRef = db.ref(`users/${userId}`);
        const user = await userRef.once("value");
        console.log("KERTWANGING OUTGOING user in getUser", user.val());
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
        console.log("KERTWANGING OUTGOING updatedUser in updateUser", updatedUser.val());
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
