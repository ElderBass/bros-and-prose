import express from "express";

export const searchGoogleBooks = async (req: express.Request, res: express.Response) => {
    try {
        const { title } = req.body;
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error("Cannot search Google Books: GOOGLE_API_KEY is not set");
        }
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                title
            )}&key=${apiKey}`
        );
        const rawData: unknown = await response.json();

        console.log("KERTWANGING RAW DATA in searchGoogleBooks", rawData);

        if (
            typeof rawData !== "object" ||
            rawData === null ||
            !("items" in rawData) ||
            !Array.isArray((rawData as any).items)
        ) {
            throw new Error("Unexpected response from Google Books API");
        }

        return res.json({
            success: true,
            message: "Google Books searched successfully",
            data: rawData.items,
        });
    } catch (error) {
        console.error("Error searching Google Books", error);
        res.status(500).json({ success: false, message: "Error searching Google Books" });
    }
};
