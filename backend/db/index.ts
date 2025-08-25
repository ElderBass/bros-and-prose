import admin from "firebase-admin";
import dotenv from "dotenv";
import serviceAccountKey from "../serviceAccountKey.json" with { type: "json" };

dotenv.config();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey as admin.ServiceAccount),
    databaseURL: "https://bros-and-prose-default-rtdb.firebaseio.com/",
});

const db: admin.database.Database = admin.database();

export { db };
