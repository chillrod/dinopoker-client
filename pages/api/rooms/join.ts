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

    const { roomId, player } = req.body;

    if (!roomId) return res.status(400).json({ error: "roomId is required" });

    const room = await adminDb.ref(`dinopoker-room/${roomId}`).get();

    if (!room.exists())
      return res.status(404).json({ error: "Room not found" });

    await adminDb.ref(`dinopoker-room/${roomId}/players/${uid}`).set({
      ...player,
      id: uid,
    });

    return res.status(200).json({ uid });
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
}
