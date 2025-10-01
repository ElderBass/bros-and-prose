import admin from "firebase-admin";
import dotenv from "dotenv";
import serviceAccountKey from "../serviceAccountKey.json" with { type: "json" };

dotenv.config();

// Prefer env-provided JSON for deployment; fall back to local file in dev
let credential: admin.ServiceAccount | undefined;
try {
    const fromEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (fromEnv) {
        credential = JSON.parse(fromEnv);
    }
} catch (e) {
    console.warn("Invalid FIREBASE_SERVICE_ACCOUNT env JSON; falling back to file");
}

const ACCOUNT_KEY = (credential || (serviceAccountKey as admin.ServiceAccount)) as admin.ServiceAccount;

admin.initializeApp({
    credential: admin.credential.cert(ACCOUNT_KEY),
    databaseURL: "https://bros-and-prose-default-rtdb.firebaseio.com/",
});

const db: admin.database.Database = admin.database();

export { db };
