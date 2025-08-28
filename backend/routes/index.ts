import express from "express";
import { signup } from "./signup.ts";
import { login } from "./login.ts";
import { getBook, getBooks } from "./books.ts";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/books/:bookId", getBook);
router.get("/books", getBooks);

export default router;
