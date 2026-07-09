import type { NextApiRequest } from "next";

import { adminAuth } from "../../config/firebase/firebase-admin";

export const verifyToken = async (req: NextApiRequest): Promise<string> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : undefined;

  if (!token) throw new Error("Missing authorization token");

  const decoded = await adminAuth.verifyIdToken(token);

  return decoded.uid;
};
