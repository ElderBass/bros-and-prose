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

export const addCurrentSelection = async (req: express.Request, res: express.Response) => {
    try {
        console.log("ADD CURRENT SELECTION futureBook in addCurrentSelection", req.body);
        const futureBookRef = db.ref("books/futureBooks/current");
        await futureBookRef.child(req.body.id).set(req.body);
        const updatedSelections = await futureBookRef.once("value");
        console.log("ADD CURRENT SELECTION future books after addition: ", updatedSelections.val());
        res.json({
            success: true,
            message: "Future book selection added successfully",
            data: Object.values(updatedSelections.val()),
        });
    } catch (error) {
        console.log("ADD CURRENT SELECTION ERROR in addCurrentSelection", error);
        res.status(500).json({
            success: false,
            message: "Failed to add future book selection",
            error: error,
        });
    }
};

export const updateCurrentSelection = async (req: express.Request, res: express.Response) => {
    const { bookId } = req.params;
    console.log("UPDATE CURRENT SELECTION bookId in updateCurrentSelection", bookId);
    try {
        const futureBookRef = db.ref(`books/futureBooks/current/${bookId}`);
        await futureBookRef.set(req.body);
        const updatedSelection = await futureBookRef.once("value");
        console.log(
            "UPDATE CURRENT SELECTION kertwanged in updateCurrentSelection",
            updatedSelection.val()
        );
        res.json({
            success: true,
            message: "Future book updated successfully",
            data: updatedSelection.val(),
        });
    } catch (error) {
        console.log("UPDATE CURRENT SELECTION ERROR in updateCurrentSelection", error);
        res.status(500).json({
            success: false,
            message: "Failed to update future book",
            error: error,
        });
    }
};

export const deleteCurrentSelection = async (req: express.Request, res: express.Response) => {
    const { bookId } = req.params;
    console.log("DELETE CURRENT SELECTION bookId in deleteCurrentSelection", bookId);
    try {
        const futureBookRef = db.ref(`books/futureBooks/current/${bookId}`);
        await futureBookRef.remove();
        const updatedSelections = await db.ref("books/futureBooks/current").once("value");
        console.log(
            "DELETE CURRENT SELECTION updated future books after deletion: ",
            updatedSelections.val()
        );
        res.json({
            success: true,
            message: "Future book selection deleted successfully",
            data: Object.values(updatedSelections.val()).filter((selection: any) => selection.id),
        });
    } catch (error) {
        console.log("DELETE CURRENT SELECTION ERROR in deleteCurrentSelection", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete future book selection",
            error: error,
        });
    }
};

export const archiveFutureBooks = async (req: express.Request, res: express.Response) => {
    try {
        const archivedBooksEntry = req.body;
        console.log(
            "ARCHIVE FUTURE BOOKS archivedBooksEntry in archiveFutureBooks",
            archivedBooksEntry
        );
        const archivedBooksRef = db.ref("books/futureBooks/archived");
        await archivedBooksRef.push(archivedBooksEntry);
        const archivedBooks = await archivedBooksRef.once("value");
        console.log(
            "ARCHIVE FUTURE BOOKS archivedBooks in archiveFutureBooks",
            archivedBooks.val()
        );
        const currentSelectionsRef = db.ref("books/futureBooks/current");
        await currentSelectionsRef.set({});
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
