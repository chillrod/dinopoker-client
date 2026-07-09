import { onDisconnect } from "firebase/database";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import JoinRoomDialog from "../../components/templates/_join-room-dialog";
import { Poker } from "../../components/templates/_poker";
import { AuthService } from "../../services/auth/auth.service";
import { emitter } from "../../services/emitter/emitter";
import { NotificationsService } from "../../services/notifications/notifications.service";
import { RoomsService } from "../../services/rooms/rooms.service";

const GameRoom = () => {
  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    AuthService.ensureSignedIn().then(() => {
      if (cancelled) return;

      onDisconnect(RoomsService.PLAYER_NODE({ roomId: id })).remove();
    });

    return () => {
      cancelled = true;

      onDisconnect(RoomsService.PLAYER_NODE({ roomId: id })).cancel();
    };
  }, [id]);

  const roomCheckState = async () => {
    RoomsService.CHECK_STATE({ roomId: id });
  };

  useEffect(() => {
    if (!id) return;

    const handler = (url: string) => {
      if (url === "/") RoomsService.PLAYER_REMOVE({ roomId: id });
    };

    router.events.on("routeChangeStart", handler);

    return () => {
      router.events.off("routeChangeStart", handler);
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;

    roomCheckState();

    emitter.on("EMIT_ROOM_STATE", async ({ hasPlayer, hasRoom, player }) => {
      if (!hasRoom) {
        NotificationsService.emitScreenLoading({
          show: true,
          message: "Invalid room, redirecting...",
        });

        await router.push("/");

        NotificationsService.emitScreenLoading({
          show: false,
        });
      }

      const playerData = hasPlayer ? player?.val() : "";

      if (!hasPlayer || playerData?.toString() === "spectator") {
        NotificationsService.emitMessageBox({
          children: <JoinRoomDialog room={id?.toString()} />,
          message: "",
          func: "SET_JOIN_ROOM",
          onClose: () => router.push("/"),
          persistent: true,
        });
      }
    });

    return () => {
      emitter.off("EMIT_ROOM_STATE");
    };
  }, [id]);

  return (
    <>
      <Head>
        <title>
          Online game room! create a new room to play with your team
        </title>
        <link rel="canonical" href="/" />
        <meta
          name="description"
          content="Create a room and invite your team to join. Start planning your sprints and get feedback from your team."
        ></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Poker />
    </>
  );
};

export default GameRoom;
