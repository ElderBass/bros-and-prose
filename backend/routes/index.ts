import express from "express";
import { signup } from "./signup.ts";
import { login } from "./login.ts";
import { getBook, getBooks, updateBook } from "./books.ts";
import { getUser, getUsers, updateUser } from "./user.ts";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/books/:bookId", getBook);
router.get("/books", getBooks);
router.put("/books/:bookId", updateBook);
router.get("/users/:userId", getUser);
router.get("/users", getUsers);
router.put("/users/:userId", updateUser);

export default router;
