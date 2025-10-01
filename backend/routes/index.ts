import express from "express";
import { signup } from "./signup.js";
import { login } from "./login.js";
import { getBook, getBooks, updateBook } from "./books.js";
import { getUser, getUsers, updateUser } from "./user.js";
import { postLog } from "./log.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/books/:bookId", getBook);
router.get("/books", getBooks);
router.put("/books/:bookId", updateBook);
router.get("/users/:userId", getUser);
router.get("/users", getUsers);
router.put("/users/:userId", updateUser);
router.post("/log", postLog);

export default router;
