import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(
    cors({
        origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN.split(",").map((o) => o.trim()),
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: false,
    })
);
app.use(express.json());
app.use("/api", router);

app.get("/", (req, res) => res.send("Brose and Prose API running"));
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

app.listen(PORT, () => console.log(`API server running on port ${PORT}`));
