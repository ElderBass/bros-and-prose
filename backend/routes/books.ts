import express from "express";
import { db } from "../db/index.js";

export const getCurrentBook = async (_: express.Request, res: express.Response) => {
    try {
        const currentBookRef = db.ref("books/currentBook");
        const currentBook = await currentBookRef.once("value");
        console.log("GET CURRENT BOOK currentBook in getCurrentBook", currentBook.val());
        res.json({
            success: true,
            message: "Current book fetched successfully",
            data: currentBook.val(),
        });
    } catch (error) {
        console.log("GET CURRENT BOOK ERROR in getCurrentBook", error);
        res.status(500).json({
            success: false,
            message: "Failed to get current book",
            error: error,
        });
    }
};

export const updateCurrentBook = async (req: express.Request, res: express.Response) => {
    try {
        const currentBookRef = db.ref("books/currentBook");
        await currentBookRef.set(req.body);
        const updatedBook = await currentBookRef.once("value");
        console.log("UPDATE CURRENT BOOK updatedBook in updateCurrentBook", updatedBook.val());
        res.json({
            success: true,
            message: "Current book updated successfully",
            data: updatedBook.val(),
        });
    } catch (error) {
        console.log("UPDATE CURRENT BOOK ERROR in updateCurrentBook", error);
        res.status(500).json({
            success: false,
            message: "Failed to update current book",
            error: error,
        });
    }
};

export const getPastBooks = async (_: express.Request, res: express.Response) => {
    try {
        const pastBooksRef = db.ref("books/pastBooks");
        const pastBooks = await pastBooksRef.once("value");
        const pastBooksArray = Object.values(pastBooks.val());
        console.log("GET PAST BOOKS pastBooks in getPastBooks", pastBooksArray);
        res.json({
            success: true,
            message: "Past books fetched successfully",
            data: pastBooksArray,
        });
    } catch (error) {
        console.log("GET PAST BOOKS ERROR in getPastBooks", error);
        res.status(500).json({
            success: false,
            message: "Failed to get past books",
            error: error,
        });
    }
};

export const getPastBook = async (req: express.Request, res: express.Response) => {
    const { bookId } = req.params;
    console.log("GET PAST BOOK bookId in getPastBook", bookId);
    try {
        const pastBookRef = db.ref(`books/pastBooks/${bookId}`);
        const pastBook = await pastBookRef.once("value");
        console.log("GET PAST BOOK pastBook in getPastBook", pastBook.val());
        res.json({
            success: true,
            message: "Past book fetched successfully",
            data: pastBook.val(),
        });
    } catch (error) {
        console.log("GET PAST BOOK ERROR in getPastBook", error);
        res.status(500).json({
            success: false,
            message: "Failed to get past book",
            error: error,
        });
    }
};

export const updatePastBook = async (req: express.Request, res: express.Response) => {
    const { bookId } = req.params;
    console.log("UPDATE PAST BOOK bookId in updatePastBook", bookId);
    try {
        const pastBookRef = db.ref(`books/pastBooks/${bookId}`);
        await pastBookRef.set(req.body);
        const updatedBook = await pastBookRef.once("value");
        console.log("UPDATE PAST BOOK updatedBook in updatePastBook", updatedBook.val());
        res.json({
            success: true,
            message: "Past book updated successfully",
            data: updatedBook.val(),
        });
    } catch (error) {
        console.log("UPDATE PAST BOOK ERROR in updatePastBook", error);
        res.status(500).json({
            success: false,
            message: "Failed to update past book",
            error: error,
        });
    }
};

export const getBook = async (req: express.Request, res: express.Response) => {
    const { bookId } = req.params;
    console.log("GET BOOK bookId in getBook", bookId);
    try {
        const bookRef = db.ref(`books/${bookId}`);
        const book = await bookRef.once("value");
        console.log("GET BOOK book in getBook", book.val());
        res.json({
            success: true,
            message: "Book fetched successfully",
            data: book.val(),
        });
    } catch (error) {
        console.log("GET BOOK ERROR in getBook", error);
        res.status(500).json({
            success: false,
            message: "Failed to get book",
            error: error,
        });
    }
};

export const getBooks = async (_: express.Request, res: express.Response) => {
    try {
        const booksRef = db.ref("books");
        const books = await booksRef.once("value");
        console.log("GET BOOKS books in getBooks", Object.values(books.val()));
        res.json({
            success: true,
            message: "Books fetched successfully",
            data: Object.values(books.val()),
        });
    } catch (error) {
        console.log("GET BOOKS ERROR in getBooks", error);
        res.status(500).json({
            success: false,
            message: "Failed to get books",
            error: error,
        });
    }
};

export const updateBook = async (req: express.Request, res: express.Response) => {
    const { bookId } = req.params;
    console.log("UPDATE BOOK bookId in updateBook", bookId);
    try {
        const bookRef = db.ref(`books/${bookId}`);
        await bookRef.set(req.body);
        const updatedBook = await bookRef.once("value");
        console.log("UPDATE BOOK updatedBook in updateBook", updatedBook.val());
        res.json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook.val(),
        });
    } catch (error) {
        console.log("UPDATE BOOK ERROR in updateBook", error);
        res.status(500).json({
            success: false,
            message: "Failed to update book",
            error: error,
        });
    }
};
