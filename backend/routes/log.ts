import express from "express";

interface Log {
    message: string;
    level: string;
    timestamp: string;
    isError: boolean;
}

const buildLogOutput = (log: Log) => {
    return `[${log.timestamp}] ${log.level} - ${log.message}`;
};

export const postLog = async (req: express.Request, res: express.Response) => {
    const { log } = req.body;
    console.log("KERTWANGING INCOMING log in postLog", log);

    if (!log) {
        return res.status(400).json({
            error: "Log is required",
        });
    }
    if (log.isError) {
        console.error(buildLogOutput(log));
    } else {
        console.log(buildLogOutput(log));
    }
    res.json({
        success: true,
        message: "Log posted successfully",
    });
};
