import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Prefer env-provided JSON for deployment; fall back to local file in dev
let credential: admin.ServiceAccount = {} as admin.ServiceAccount;
try {
    const fromEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (fromEnv) {
        credential = JSON.parse(fromEnv);
    } else {
        console.log("Falling back to local file");
        credential = require("../serviceAccountKey.json");
    }
} catch (e) {
    console.warn("Invalid FIREBASE_SERVICE_ACCOUNT env JSON; falling back to file");
}

admin.initializeApp({
    credential: admin.credential.cert(credential),
    databaseURL: "https://bros-and-prose-default-rtdb.firebaseio.com/",
});

const db: admin.database.Database = admin.database();

export { db };
