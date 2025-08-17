import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Brose and Prose API running"));

app.listen(3000, () => console.log("API server running on port 3000"));
