import express from "express";
import bcrypt from "bcrypt";
import { db } from "../db/index.ts";

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required",
            });
        }

        // Find user by email
        const usersRef = db.ref("users");
        const snapshot = await usersRef.once("value");

        if (!snapshot.exists()) {
            return res.status(401).json({
                error: "Invalid email or password",
            });
        }

        const users = snapshot.val();
        const user = Object.values(users).find(
            (u: any) => u.email === email.toLowerCase().trim()
        ) as any;

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password",
            });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                error: "Invalid email or password",
            });
        }

        const { password: _, ...userResponse } = user;
        userResponse.isLoggedIn = true;

        res.json({
            success: true,
            message: "Login successful",
            user: userResponse,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            error: "Internal server error during login",
        });
    }
};
