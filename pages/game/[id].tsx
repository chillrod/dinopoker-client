import { DatabaseReference, onDisconnect } from "firebase/database";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import JoinRoomDialog from "../../components/templates/_join-room-dialog";
import { Poker } from "../../components/templates/_poker";
import { emitter } from "../../services/emitter/emitter";
import { NotificationsService } from "../../services/notifications/notifications.service";
import { RoomsService } from "../../services/rooms/rooms.service";

const GameRoom = () => {
  const router = useRouter();

  const { id } = router.query;


  useEffect(() => {
    onDisconnect(RoomsService.PLAYER_NODE({ roomId: id })).set('offline');

    return () => {
      onDisconnect(RoomsService.PLAYER_NODE({ roomId: id })).cancel();
    }
  }, [])

  useEffect(() => {
    RoomsService.CHECK_STATE({ roomId: id })
  }, []);

  useEffect(() => { }, [])

  useEffect(() => {
    emitter.on('EMIT_ROOM_STATE', async ({ hasPlayer, hasRoom, player }) => {


      if (!hasRoom) {
        NotificationsService.emitScreenLoading({
          show: true,
          message: 'Invalid room, redirecting...'
        })

        await router.push("/");

        NotificationsService.emitScreenLoading({
          show: false,
        })
      }

      const playerData = hasPlayer ? player?.val() : '';
      console.log("🚀 ~ file: _poker.tsx ~ line 42 ~ emitter.on ~ playerData", playerData)

      if (!hasPlayer || playerData?.toString() === 'offline') {
        NotificationsService.emitMessageBox({
          children: <JoinRoomDialog room={id?.toString()} />,
          message: "",
          func: "SET_JOIN_ROOM",
          onClose: () => router.push("/"),
        });
      }
    })

    return () => {
      emitter.off('EMIT_ROOM_STATE')
    }
  }, [])

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
