import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.get("/", (req, res) => res.send("Brose and Prose API running"));

app.listen(PORT, () => console.log("API server running on port 3000"));
