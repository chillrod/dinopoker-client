import {
  Box,
  Center,
  Container,
  GridItem,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { DataSnapshot, getDatabase, onValue, ref } from "firebase/database";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { appFirebase } from "../../config/firebase/firebase";
import { VoteSystemOptions } from "../../config/vote-system/vote-system";
import { IPlayerData } from "../../model/PlayerData";
import { IRoomData, RoomDataStatus } from "../../model/RoomData";
import { AuthService } from "../../services/auth/auth.service";
import { emitter } from "../../services/emitter/emitter";
import { PlayerService } from "../../services/player/player.service";
import { RoomsService } from "../../services/rooms/rooms.service";
import { CardPoints } from "../atoms/card-points/card-points";
import { PokerMenu } from "../molecules/poker-menu/poker-menu";
import { PokerRoundData } from "../molecules/poker-round-data/poker-round-data";
import { PlainTemplate } from "./_plain-template";

const db = getDatabase(appFirebase);
const status = ({ id }: { id?: string | string[] }) =>
  ref(db, `dinopoker-room/${id}/status`);
const voteSystem = ({ id }: { id?: string | string[] }) =>
  ref(db, `dinopoker-room/${id}/voteSystem`);
const players = ({ id }: { id?: string | string[] }) =>
  ref(db, `dinopoker-room/${id}/players`);

export const Poker = () => {
  const router = useRouter();
  const [ROOM_DATA, SET_ROOM_DATA] = useState<IRoomData>({} as IRoomData);
  const [CURRENT_PLAYER, SET_CURRENT_PLAYER] = useState<IPlayerData>();
  const [SPECTATOR, SET_SPECTATOR] = useState(false);

  const { id } = router.query;

  const handleCurrentPlayers = (currentPlayers: DataSnapshot | any) => {
    if (!currentPlayers) return;

    const players = Object.keys(currentPlayers).map((player) => {
      const current = currentPlayers[player];

      if (current !== "spectator") return { ...current, id: player };
    });

    return players;
  };

  const handleDisabled = (players?: IPlayerData[]): boolean => {
    if (!players) return true;

    if (ROOM_DATA.status === RoomDataStatus.REVEALED) return true;

    return Object.keys(players).length === 0;
  };

  useEffect(() => {
    if (!id) return;

    let subscribeStatus = () => {};
    let subscribeVoteSystem = () => {};
    let subscribePlayers = () => {};
    let cancelled = false;

    AuthService.ensureSignedIn().then((user) => {
      if (cancelled) return;

      subscribeStatus = onValue(
        status({ id }),
        (data) => {
          if (data.val() === RoomDataStatus.PENDING) {
            RoomsService.UPDATE_PLAYER({
              roomId: id,
              key: "vote",
              value: null,
              player: user.uid,
            });
          }

          SET_ROOM_DATA((prevState) => ({ ...prevState, status: data.val() }));
        },
        (error) => console.error("[dinopoker] status subscription error", error)
      );

      subscribeVoteSystem = onValue(
        voteSystem({ id }),
        (data) => {
          SET_ROOM_DATA((prevState) => ({
            ...prevState,
            voteSystem: data.val(),
          }));
        },
        (error) =>
          console.error("[dinopoker] voteSystem subscription error", error)
      );

      subscribePlayers = onValue(
        players({ id }),
        (data) => {
          SET_ROOM_DATA((prevState) => ({ ...prevState, players: data.val() }));

          const currentPlayer = data.child(user.uid);

          if (currentPlayer.val() === "spectator") {
            SET_CURRENT_PLAYER(currentPlayer.val());

            return PlayerService.SET_SPECTATOR(true);
          }

          SET_CURRENT_PLAYER({ ...currentPlayer.val(), id: currentPlayer.key });
        },
        (error) =>
          console.error("[dinopoker] players subscription error", error)
      );
    });

    return () => {
      cancelled = true;
      subscribeStatus();
      subscribeVoteSystem();
      subscribePlayers();
    };
  }, [id]);

  useEffect(() => {
    emitter.on("SET_SPECTATOR", (data) => {
      SET_SPECTATOR(data);
    });

    return () => {
      emitter.off("SET_SPECTATOR");
    };
  }, []);

  return (
    <>
      <PlainTemplate
        minH="calc(100vh - 65px)"
        align="center"
        justify="center"
        cols={["1fr"]}
        rows={["1fr"]}
        areas={[`"poker"`]}
      >
        {ROOM_DATA.players ? (
          <GridItem area="poker" w="100%" pb={{ base: "200px", md: "180px" }}>
            <PokerRoundData
              currentPlayers={handleCurrentPlayers(ROOM_DATA.players)}
              roomStatus={ROOM_DATA?.status}
            />
          </GridItem>
        ) : (
          <GridItem area="poker">
            <Center>
              <Spinner />
            </Center>
          </GridItem>
        )}
      </PlainTemplate>

      {ROOM_DATA.players && (
        <Box
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          zIndex={20}
          bg="rgba(33, 33, 33, 0.7)"
          backdropFilter="blur(14px) saturate(150%)"
          borderTop="1px solid rgba(255, 255, 255, 0.08)"
          boxShadow="0 -12px 40px rgba(0, 0, 0, 0.4)"
          py={4}
        >
          <Container maxW="container.xl">
            <Text
              fontSize="xs"
              fontWeight={600}
              color="dino.base1"
              textTransform="uppercase"
              letterSpacing="wide"
              textAlign="center"
              mb={2}
            >
              Pick your estimate
            </Text>
            <Stack
              direction="row"
              flexWrap="nowrap"
              overflowX="auto"
              overflowY="hidden"
              w={["80vw", "80vw", "100%", "100%"]}
              margin="0 auto"
              justifyContent={{ base: "flex-start", md: "center" }}
              px={2}
              py={1}
            >
              {VoteSystemOptions[ROOM_DATA.voteSystem]?.voteSystem.map(
                (number: number) => (
                  <Box key={number} flexShrink={0}>
                    <CardPoints
                      disabled={
                        handleDisabled(ROOM_DATA.players) ||
                        CURRENT_PLAYER === "spectator"
                      }
                      onClick={(vote) =>
                        RoomsService.UPDATE_PLAYER({
                          roomId: id,
                          player: CURRENT_PLAYER?.id,
                          value: CURRENT_PLAYER?.vote === vote ? 0 : vote,
                          key: "vote",
                        })
                      }
                      selected={CURRENT_PLAYER?.vote === number}
                      point={number}
                    />
                  </Box>
                )
              )}
            </Stack>
          </Container>
        </Box>
      )}
    </>
  );
};
