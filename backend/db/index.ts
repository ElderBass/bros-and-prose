import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const credentialsJson = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!credentialsJson) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT env var is required in production");
}
const credential = JSON.parse(credentialsJson);

admin.initializeApp({
    credential: admin.credential.cert(credential),
    databaseURL: "https://bros-and-prose-default-rtdb.firebaseio.com/",
});

const db: admin.database.Database = admin.database();

export { db };
