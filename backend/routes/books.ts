import express from "express";
import { db } from "../db/index.js";

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

export const getFutureBooks = async (_: express.Request, res: express.Response) => {
    try {
        console.log("Calling GET FUTURE BOOKS route");
        const futureBooksRef = db.ref("books/futureBooks");
        const futureBooks = await futureBooksRef.once("value");
        console.log("GET FUTURE BOOKS futureBooks in getFutureBooks", futureBooks.val());
        if (futureBooks.val()) {
            if (Object.keys(futureBooks.val()).length > 1 && futureBooks.val().isEmpty) {
                res.json({
                    success: true,
                    message: "Future books fetched successfully",
                    data: Object.values(futureBooks.val()).filter((book: any) => book.id),
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "No future books found",
                    data: [],
                });
            }
        }
    } catch (error) {
        console.log("GET FUTURE BOOKS ERROR in getFutureBooks", error);
        res.status(500).json({
            success: false,
            message: "Failed to get future books",
            error: error,
        });
    }
};

export const addFutureBook = async (req: express.Request, res: express.Response) => {
    try {
        console.log("ADD FUTURE BOOK futureBook in addFutureBook", req.body);
        const futureBookRef = db.ref("books/futureBooks");
        await futureBookRef.child(req.body.id).set(req.body);
        const addedFutureBook = await futureBookRef.once("value");
        console.log("ADD FUTURE BOOK addedFutureBook in addFutureBook", addedFutureBook.val());
        res.json({
            success: true,
            message: "Future book added successfully",
            data: addedFutureBook.val()[req.body.id],
        });
    } catch (error) {
        console.log("ADD FUTURE BOOK ERROR in addFutureBook", error);
        res.status(500).json({
            success: false,
            message: "Failed to add future book",
            error: error,
        });
    }
};

export const updateFutureBook = async (req: express.Request, res: express.Response) => {
    const { bookId } = req.params;
    console.log("UPDATE FUTURE BOOK bookId in updateFutureBook", bookId);
    try {
        const futureBookRef = db.ref(`books/futureBooks/${bookId}`);
        await futureBookRef.set(req.body);
        const updatedFutureBook = await futureBookRef.once("value");
        console.log(
            "UPDATE FUTURE BOOK kertwanged in updateFutureBook",
            updatedFutureBook.val()
        );
        res.json({
            success: true,
            message: "Future book updated successfully",
            data: updatedFutureBook.val(),
        });
    } catch (error) {
        console.log("UPDATE FUTURE BOOK ERROR in updateFutureBook", error);
        res.status(500).json({
            success: false,
            message: "Failed to update future book",
            error: error,
        });
    }
};

export const deleteFutureBook = async (req: express.Request, res: express.Response) => {
    const { bookId } = req.params;
    console.log("DELETE FUTURE BOOK bookId in deleteFutureBook", bookId);
    try {
        const futureBookRef = db.ref(`books/futureBooks/${bookId}`);
        await futureBookRef.remove();
        const futureBooks = await db.ref("books/futureBooks").once("value");
        console.log("DELETE FUTURE BOOK updated future books after deletion: ", futureBooks.val());
        res.json({
            success: true,
            message: "Future book deleted successfully",
            data: Object.values(futureBooks.val()).filter((book: any) => book.id),
        });
    } catch (error) {
        console.log("DELETE FUTURE BOOK ERROR in deleteFutureBook", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete future book",
            error: error,
        });
    }
};
