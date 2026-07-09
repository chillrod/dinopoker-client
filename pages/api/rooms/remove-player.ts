import type { NextApiRequest, NextApiResponse } from "next";

import { adminDb } from "../../../config/firebase/firebase-admin";
import { verifyToken } from "../../../services/auth/verify-token";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const uid = await verifyToken(req);

    const { roomId } = req.body;

    if (!roomId) return res.status(400).json({ error: "roomId is required" });

    await adminDb.ref(`dinopoker-room/${roomId}/players/${uid}`).remove();

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
}
