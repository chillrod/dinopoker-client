import type { NextApiRequest, NextApiResponse } from "next";

import { adminDb } from "../../../config/firebase/firebase-admin";
import { RoomDataStatus } from "../../../model/RoomData";
import { verifyToken } from "../../../services/auth/verify-token";
import { makeUuid } from "../../../utils/MakeUuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await verifyToken(req);

    const { voteSystem } = req.body;

    if (!voteSystem)
      return res.status(400).json({ error: "voteSystem is required" });

    const roomId = makeUuid();

    await adminDb.ref(`dinopoker-room/${roomId}`).set({
      id: roomId,
      status: RoomDataStatus.PENDING,
      voteSystem,
    });

    return res.status(200).json({ roomId });
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
}
