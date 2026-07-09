import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  User,
} from "firebase/auth";

import { appFirebase } from "../../config/firebase/firebase";

export const auth = getAuth(appFirebase);

let signInPromise: Promise<User> | null = null;

export const AuthService = {
  ensureSignedIn(): Promise<User> {
    if (auth.currentUser) return Promise.resolve(auth.currentUser);

    if (!signInPromise) {
      signInPromise = new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            if (user) {
              unsubscribe();
              resolve(user);
            }
          },
          (err) => {
            unsubscribe();
            reject(err);
          }
        );

        signInAnonymously(auth).catch((err) => {
          unsubscribe();
          reject(err);
        });
      });
    }

    return signInPromise;
  },

  async getIdToken(): Promise<string> {
    const user = await this.ensureSignedIn();

    return user.getIdToken();
  },

  getUid(): string | undefined {
    return auth.currentUser?.uid;
  },
};
