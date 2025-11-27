import express from "express";
import { db } from "../db/index.js";
import { sendEmailNotification } from "../mailjet/sendEmailNotification.js";

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
    const { entry, metadata } = req.body;
    console.log("ADD PALAVER ENTRIES entry in addPalaverEntry", entry);
    console.log("ADD PALAVER ENTRIES metadata in addPalaverEntry", metadata);
    try {
        await db.ref("palaver").child(entry.id).set(entry);
        sendEmailNotification(entry.type, metadata);
        res.json({
            success: true,
            message: "Palaver entry added successfully",
            data: entry,
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
    const { entry, metadata } = req.body;
    console.log("UPDATE PALAVER ENTRY entry in updatePalaverEntry", entry);

    try {
        const entryRef = db.ref(`palaver/${entryId}`);
        await entryRef.set(entry);
        const updatedEntry = await entryRef.once("value");

        console.log("UPDATE PALAVER ENTRY updatedEntry in updatePalaverEntry", updatedEntry.val());
        res.json({
            success: true,
            message: `Palaver entry ${entryId} updated successfully`,
            data: updatedEntry.val(),
        });

        sendEmailNotification(metadata.updateType ?? entry.type, metadata);
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
