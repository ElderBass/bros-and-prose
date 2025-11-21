import express from "express";
import { db } from "../db/index.js";

export const getCurrentFutureBooks = async (_: express.Request, res: express.Response) => {
    try {
        const currentFutureBooksRef = db.ref("books/futureBooks/current");
        const currentFutureBooks = await currentFutureBooksRef.once("value");
        console.log(
            "GET CURRENT FUTURE BOOKS currentFutureBooks in getCurrentFutureBooks",
            currentFutureBooks.val()
        );
        res.json({
            success: true,
            message: "Current future books fetched successfully",
            data: Object.values(currentFutureBooks.val()),
        });
    } catch (error) {
        console.log("GET CURRENT FUTURE BOOKS ERROR in getCurrentFutureBooks", error);
        res.status(500).json({
            success: false,
            message: "Failed to get current future books",
            error: error,
        });
    }
};

export const getArchivedFutureBooks = async (_: express.Request, res: express.Response) => {
    try {
        const archivedFutureBooksRef = db.ref("books/futureBooks/archived");
        const archivedFutureBooks = await archivedFutureBooksRef.once("value");
        console.log(
            "GET ARCHIVED FUTURE BOOKS archivedFutureBooks in getArchivedFutureBooks",
            archivedFutureBooks.val()
        );
        res.json({
            success: true,
            message: "Archived future books fetched successfully",
            data: Object.values(archivedFutureBooks.val()),
        });
    } catch (error) {
        console.log("GET ARCHIVED FUTURE BOOKS ERROR in getArchivedFutureBooks", error);
        res.status(500).json({
            success: false,
            message: "Failed to get archived future books",
            error: error,
        });
    }
};

export const getCurrentSelector = async (_: express.Request, res: express.Response) => {
    try {
        const currentSelectorRef = db.ref("books/futureBooks/currentSelector");
        const currentSelector = await currentSelectorRef.once("value");
        res.json({
            success: true,
            message: "Current selector fetched successfully",
            data: currentSelector.val(),
        });
    } catch (error) {
        console.log("GET CURRENT SELECTOR ERROR in getCurrentSelector", error);
        res.status(500).json({
            success: false,
            message: "Failed to get current selector",
            error: error,
        });
    }
};

export const setFutureBookSelector = async (req: express.Request, res: express.Response) => {
    try {
        const { selectorId } = req.body;
        const futureBookSelectorRef = db.ref("books/futureBooks/currentSelector");
        await futureBookSelectorRef.set(selectorId);
        console.log("SET FUTURE BOOK SELECTOR selectorId in setFutureBookSelector", selectorId);
        res.json({
            success: true,
            message: "Future book selector set successfully",
            data: selectorId,
        });
    } catch (error) {
        console.log("SET FUTURE BOOK SELECTOR ERROR in setFutureBookSelector", error);
        res.status(500).json({
            success: false,
            message: "Failed to set future book selector",
            error: error,
        });
    }
};

export const addFutureBook = async (req: express.Request, res: express.Response) => {
    try {
        console.log("ADD FUTURE BOOK futureBook in addFutureBook", req.body);
        const futureBookRef = db.ref("books/futureBooks/current");
        await futureBookRef.child(req.body.id).set(req.body);
        const addedFutureBook = await futureBookRef.once("value");
        console.log("ADD FUTURE BOOK future books after addition: ", addedFutureBook.val());
        res.json({
            success: true,
            message: "Future book added successfully",
            data: Object.values(addedFutureBook.val()),
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
        const futureBookRef = db.ref(`books/futureBooks/current/${bookId}`);
        await futureBookRef.set(req.body);
        const updatedFutureBook = await futureBookRef.once("value");
        console.log("UPDATE FUTURE BOOK kertwanged in updateFutureBook", updatedFutureBook.val());
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
        const futureBookRef = db.ref(`books/futureBooks/current/${bookId}`);
        await futureBookRef.remove();
        const futureBooks = await db.ref("books/futureBooks/current").once("value");
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

export const archiveFutureBooks = async (req: express.Request, res: express.Response) => {
    try {
        const { archivedBooksEntry } = req.body;
        const futureBooksRef = db.ref("books/futureBooks/archived");
        await futureBooksRef.push(archivedBooksEntry);
        const archivedBooks = await futureBooksRef.once("value");
        res.json({
            success: true,
            message: "Future books archived successfully",
            data: Object.values(archivedBooks.val()),
        });
    } catch (error) {
        console.log("ARCHIVE FUTURE BOOKS ERROR in archiveFutureBooks", error);
        res.status(500).json({
            success: false,
            message: "Failed to archive future books",
            error: error,
        });
    }
};
