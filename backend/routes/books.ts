import express from "express";
import { db } from "../db/index.js";

export const getBook = async (req: express.Request, res: express.Response) => {
    const { bookId } = req.params;
    console.log("KERTWANGING INCOMING book in getBook", bookId);
    try {
        const bookRef = db.ref(`books/${bookId}`);
        const book = await bookRef.once("value");
        console.log("KERTWANGING OUTGOING book in getBook", book.val());
        res.json({
            success: true,
            message: "Book fetched successfully",
            data: book.val(),
        });
    } catch (error) {
        console.log("KERTWANGING ERROR in getBook", error);
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
        console.log("KERTWANGING OUTGOING books in getBooks", Object.values(books.val()));
        res.json({
            success: true,
            message: "Books fetched successfully",
            data: Object.values(books.val()),
        });
    } catch (error) {
        console.log("KERTWANGING ERROR in getBooks", error);
        res.status(500).json({
            success: false,
            message: "Failed to get books",
            error: error,
        });
    }
};

export const updateBook = async (req: express.Request, res: express.Response) => {
    const { bookId } = req.params;
    console.log("KERTWANGING INCOMING bookId in updateBook", bookId);
    try {
        const bookRef = db.ref(`books/${bookId}`);
        await bookRef.set(req.body);
        const updatedBook = await bookRef.once("value");
        console.log("KERTWANGING OUTGOING updatedBook in updateBook", updatedBook.val());
        res.json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook.val(),
        });
    } catch (error) {
        console.log("KERTWANGING ERROR in updateBook", error);
        res.status(500).json({
            success: false,
            message: "Failed to update book",
            error: error,
        });
    }
};
