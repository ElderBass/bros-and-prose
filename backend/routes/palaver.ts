import express from "express";
import { db } from "../db/index.js";

export const getPalaverEntries = async (_: express.Request, res: express.Response) => {
    try {
        const entries = await db.ref("palaver").once("value");
        console.log("GET PALAVER ENTRIES entries in getPalaverEntries", entries.val());
        res.json({
            success: true,
            message: "Palaver entries fetched successfully",
            data: Array.from(Object.values(entries.val())),
        });
    } catch (error) {
        console.log("GET PALAVER ENTRIES ERROR in getPalaverEntries", error);
        res.status(500).json({
            success: false,
            message: "Failed to get palaver entries",
            error: error,
        });
    }
};

export const addPalaverEntry = async (req: express.Request, res: express.Response) => {
    console.log("ADD PALAVER ENTRIES entry in addPalaverEntry", req.body);
    try {
        const entriesRef = await db.ref("palaver").push(req.body);
        const updatedEntries = await entriesRef.child(req.body.id).once("value");
        console.log("ADD PALAVER ENTRIES updatedEntries in addPalaverEntry", updatedEntries.val());
        res.json({
            success: true,
            message: "Palaver entry added successfully",
            data: updatedEntries.val(),
        });
    } catch (error) {
        console.log("ADD PALAVER ENTRIES ERROR in addPalaverEntry", error);
        res.status(500).json({
            success: false,
            message: "Failed to add palaver entry",
            error: error,
        });
    }
};

export const updatePalaverEntry = async (req: express.Request, res: express.Response) => {
    const { entryId } = req.params;
    console.log("UPDATE PALAVER ENTRY entryId in updatePalaverEntry", entryId);
    console.log("UPDATE PALAVER ENTRY req.body in updatePalaverEntry", req.body);
    try {
        const entryRef = db.ref(`palaver/${entryId}`);
        await entryRef.set(req.body);
        const updatedEntry = await entryRef.once("value");
        console.log("UPDATE PALAVER ENTRY updatedEntry in updatePalaverEntry", updatedEntry.val());
        res.json({
            success: true,
            message: `Palaver entry ${entryId} updated successfully`,
            data: updatedEntry.val(),
        });
    } catch (error) {
        console.log("UPDATE PALAVER ENTRY ERROR in updatePalaverEntry", error);
        res.status(500).json({
            success: false,
            message: `Failed to update palaver entry ${entryId}`,
            error: error,
        });
    }
};

export const deletePalaverEntry = async (req: express.Request, res: express.Response) => {
    const { entryId } = req.params;
    console.log("DELETE PALAVER ENTRY entryId in deletePalaverEntry", entryId);
    try {
        const entryRef = db.ref(`palaver/${entryId}`);
        await entryRef.remove();
        res.json({
            success: true,
            message: `Palaver entry ${entryId} deleted successfully`,
        });
    } catch (error) {
        console.log("DELETE PALAVER ENTRY ERROR in deletePalaverEntry", error);
        res.status(500).json({
            success: false,
            message: `Failed to delete palaver entry ${entryId}`,
            error: error,
        });
    }
};
