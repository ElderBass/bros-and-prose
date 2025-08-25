import express from "express";
import bcrypt from "bcrypt";
import { db } from "../db/index.ts";
import { login } from "./login.ts";

export const signup = async (req: express.Request, res: express.Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                error: "First name, last name, email, and password are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "Password must be at least 6 characters",
            });
        }

        // Login user if they already exist
        const usersRef = db.ref("users");
        const snapshot = await usersRef.once("value");

        if (snapshot.exists()) {
            const users = snapshot.val();
            const existingUser = Object.values(users).find((user: any) => user.email === email);

            if (existingUser) {
                return login(req, res);
            }
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generate unique user ID
        const userId = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;

        const userData = {
            id: userId,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            currentBookProgress: 0,
            reviews: [],
        };

        // Save to Firebase
        await usersRef.child(userId).set(userData);

        // Return user data (without password)
        const { password: _, ...userResponse } = userData;

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: userResponse,
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            error: "Internal server error during signup",
        });
    }
};
