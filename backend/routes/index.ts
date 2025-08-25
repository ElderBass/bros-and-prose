import express from "express";
import { signup } from "./signup.ts";
import { login } from "./login.ts";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;
