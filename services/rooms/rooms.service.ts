import { child, get, getDatabase, ref } from "firebase/database";

import { appFirebase } from "../../config/firebase/firebase";
import { InitializePlayerData, IPlayerData } from "../../model/PlayerData";
import { RoomDataStatus } from "../../model/RoomData";
import { AuthService } from "../auth/auth.service";
import { NotificationsService } from "../notifications/notifications.service";

const db = getDatabase(appFirebase);

const callRoomsApi = async (path: string, body: Record<string, any>) => {
  const token = await AuthService.getIdToken();

  const response = await fetch(`/api/rooms/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.error || "Request failed");

  return data;
};

export const RoomsService = {
  async CREATE_ROOM({
    player,
    voteSystem,
  }: {
    player: IPlayerData;
    voteSystem: string;
  }) {
    const { roomId } = await callRoomsApi("create", { voteSystem });

    const playerData = InitializePlayerData({
      ...player,
      room: roomId,
    });

    return { playerFromCreateRoom: playerData };
  },

  async JOIN_ROOM({ player }: { player: IPlayerData }) {
    if (!player.room) throw new Error("Room not found");

    await callRoomsApi("join", { roomId: player.room, player });
  },

  async UPDATE_PLAYER({
    player,
    roomId,
    key,
    value,
  }: {
    player?: string;
    key?: string;
    roomId?: string | string[];
    value?: any;
  }) {
    if (!player) return;

    await callRoomsApi("update-player", { roomId, player, key, value });
  },

  async UPDATE_ROOM({
    roomId,
    key,
    value,
  }: {
    roomId?: string | string[];
    key?: string;
    value?: any;
  }) {
    if (!roomId) return;

    await callRoomsApi("update-room", { roomId, key, value });
  },

  async CHECK_STATE({ roomId }: { roomId?: string | string[] }) {
    const currentUser = await AuthService.ensureSignedIn();

    const room = await get(ref(db, "dinopoker-room/" + roomId));

    const players = await get(
      ref(db, "dinopoker-room/" + roomId + "/players")
    ).then((res) => res);

    const playerId = currentUser.uid;

    if (!playerId)
      return NotificationsService.emitRoomState({
        hasPlayer: false,
        hasRoom: room.exists(),
      });

    const hasChild = players.hasChild(playerId);

    return NotificationsService.emitRoomState({
      hasPlayer: hasChild,
      hasRoom: room.exists(),
      ...(hasChild && {
        player: players.child(playerId),
      }),
    });
  },

  PLAYER_NODE({ roomId }: { roomId?: string | string[] }) {
    return child(
      ref(db),
      `dinopoker-room/${roomId}/players/${AuthService.getUid()}`
    );
  },

  async SET_SPECTATOR({ roomId }: { roomId?: string | string[] }) {
    if (!roomId) return;

    await callRoomsApi("set-spectator", { roomId });
  },

  async PLAYER_REMOVE({ roomId }: { roomId?: string | string[] }) {
    if (!roomId) return;

    await callRoomsApi("remove-player", { roomId });
  },
};
