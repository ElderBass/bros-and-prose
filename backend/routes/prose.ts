import express from "express";
import { db } from "../db/index.js";

export const getProseEntries = async (_: express.Request, res: express.Response) => {
    try {
        const proseEntries = await db.ref("prose").once("value");
        const proseEntriesData = proseEntries.val();
        const values = proseEntriesData ? Object.values(proseEntriesData) : [];

        values.sort((a, b) => {
            const aCreatedAt = Date.parse(
                typeof a === "object" && a !== null && "createdAt" in a
                    ? String((a as { createdAt?: string }).createdAt ?? "")
                    : ""
            );
            const bCreatedAt = Date.parse(
                typeof b === "object" && b !== null && "createdAt" in b
                    ? String((b as { createdAt?: string }).createdAt ?? "")
                    : ""
            );
            return bCreatedAt - aCreatedAt;
        });

        res.json({
            success: true,
            message: "Prose entries fetched successfully",
            data: values,
        });
    } catch (error) {
        console.log("GET PROSE ENTRIES ERROR in getProseEntries", error);
        res.status(500).json({
            success: false,
            message: "Failed to get prose entries",
            error: error,
        });
    }
};

export const addProseEntry = async (req: express.Request, res: express.Response) => {
    const { entry } = req.body;

    console.log("KERTWANGING INCOMING entry in addProseEntry", entry);

    try {
        await db.ref("prose").child(entry.id).set(entry);
        res.json({
            success: true,
            message: "Prose entry added successfully",
            data: entry,
        });
    } catch (error) {
        console.log("ADD PROSE ENTRY ERROR in addProseEntry", error);
        res.status(500).json({
            success: false,
            message: "Failed to add prose entry",
            error: error,
        });
    }
};

export const updateProseEntry = async (req: express.Request, res: express.Response) => {
    const { entryId } = req.params;
    const { entry } = req.body;

    console.log("KERTWANGING INCOMING entry in updateProseEntry", entry);

    try {
        const entryRef = db.ref(`prose/${entryId}`);
        await entryRef.set(entry);
        const updatedEntry = await entryRef.once("value");

        res.json({
            success: true,
            message: `Prose entry ${entryId} updated successfully`,
            data: updatedEntry.val(),
        });
    } catch (error) {
        console.log("UPDATE PROSE ENTRY ERROR in updateProseEntry", error);
        res.status(500).json({
            success: false,
            message: `Failed to update prose entry ${entryId}`,
            error: error,
        });
    }
};

export const deleteProseEntry = async (req: express.Request, res: express.Response) => {
    const { entryId } = req.params;

    console.log("KERTWANGING INCOMING entryId in deleteProseEntry", entryId);

    try {
        const entryRef = db.ref(`prose/${entryId}`);
        await entryRef.remove();
        res.json({
            success: true,
            message: `Prose entry ${entryId} deleted successfully`,
        });
    } catch (error) {
        console.log("DELETE PROSE ENTRY ERROR in deleteProseEntry", error);
        res.status(500).json({
            success: false,
            message: `Failed to delete prose entry ${entryId}`,
            error: error,
        });
    }
};
