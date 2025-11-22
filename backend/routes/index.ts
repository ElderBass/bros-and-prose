import express from "express";
import { signup } from "./signup.js";
import { login } from "./login.js";
import { getBook, getBooks, updateBook } from "./books.js";
import {
    getCurrentFutureBooks,
    getArchivedFutureBooks,
    getCurrentSelector,
    setFutureBookSelector,
    addCurrentSelection,
    updateCurrentSelection,
    deleteCurrentSelection,
    archiveFutureBooks,
} from "./futureBooks.js";
import { getUser, getUsers, updateUser } from "./user.js";
import { postLog } from "./log.js";
import {
    getPalaverEntries,
    addPalaverEntry,
    updatePalaverEntry,
    deletePalaverEntry,
} from "./palaver.js";

const router = express.Router();

// AUTH ROUTES
router.post("/signup", signup);
router.post("/login", login);

// BOOKS ROUTES
router.get("/books/:bookId", getBook);
router.get("/books", getBooks);
router.put("/books/:bookId", updateBook);

// FUTURE BOOKS ROUTES
router.post("/futureBooks/current", addCurrentSelection);
router.put("/futureBooks/current/:bookId", updateCurrentSelection);
router.delete("/futureBooks/current/:bookId", deleteCurrentSelection);
router.get("/futureBooks/current", getCurrentFutureBooks);
router.get("/futureBooks/archived", getArchivedFutureBooks);
router.post("/futureBooks/archived", archiveFutureBooks);
router.get("/futureBooks/currentSelector", getCurrentSelector);
router.post("/futureBooks/setSelector", setFutureBookSelector);

// USER ROUTES
router.get("/users/:userId", getUser);
router.get("/users", getUsers);
router.put("/users/:userId", updateUser);

// PALAVER ROUTES
router.get("/palaver", getPalaverEntries);
router.post("/palaver", addPalaverEntry);
router.put("/palaver/:entryId", updatePalaverEntry);
router.delete("/palaver/:entryId", deletePalaverEntry);

// LOGGER
router.post("/log", postLog);

export default router;
