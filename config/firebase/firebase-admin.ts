import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";

const ADMIN_APP_NAME = "dinopoker-admin";

const adminApp =
  getApps().find((app) => app.name === ADMIN_APP_NAME) ??
  initializeApp(
    {
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
    },
    ADMIN_APP_NAME
  );

export const adminAuth = getAuth(adminApp);
export const adminDb = getDatabase(adminApp);
