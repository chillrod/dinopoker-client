import { Avatar, AvatarBadge, Flex, Tag, Text } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";

import { CharacterList } from "../../../config/characters";
import { IPlayerData } from "../../../model/PlayerData";
import { RoomDataStatus } from "../../../model/RoomData";

interface ICharacterCardProps {
  character: IPlayerData;
  status?: RoomDataStatus;
  isRevealed?: boolean;
}

export const PokerCharacter = ({
  character,
  status,
  isRevealed,
}: ICharacterCardProps) => {
  const { t } = useTranslation("common");

  const parseSecretVoteBasedOnRoomStatus = (
    status?: RoomDataStatus,
    vote?: number,
    revealed?: boolean
  ) => {
    if (typeof vote === "string") return vote;

    if (!status) return "-";

    const states: { [key in RoomDataStatus]: string | number | undefined } = {
      1: "-",
      2: "-",
      3: vote,
    };

    if (revealed) return states[RoomDataStatus.NOTE_REVEALED];

    return states[status];

    // if (status === "REVEALED" && !isRevealed) return "-";

    // return states[status];
  };

  const parseCharacterTeam = (team: number) => {
    const arrayState = [
      "-",
      t("poker.actions.team-one"),
      t("poker.actions.team-two"),
      t("poker.actions.no-team"),
    ];

    return arrayState[team];
  };

  const parseCharacterTeamColor = (team: number) => {
    const arrayState = ["", "yellow.400", "blue.300", ""];

    return arrayState[team];
  };

  const parseCharacterColor = (character: IPlayerData) => {
    if (character.raiseHand) return "yellow.500";

    if (typeof character.vote === "string") return "purple.800";

    if (character.vote) return "dino.primary";

    return "none";
  };

  return (
    <>
      <Flex direction="column" alignItems="center" gap={2}>
        <Tag
          fontSize="sm"
          color={character?.team ? parseCharacterTeamColor(character.team) : ""}
        >
          <Text noOfLines={1} maxWidth="8em" mr={1}>
            {character.raiseHand ? `${character.name} 🤚` : character.name}{" "}
          </Text>
          {character?.team ? `(${parseCharacterTeam(character.team)})` : "-"}
        </Tag>
        <Avatar
          loading="eager"
          src={`/${CharacterList[character?.character || 0].src}`}
          size="lg"
          name={character.name ? character.name : "Unknown"}
          bg={parseCharacterColor(character)}
        >
          <AvatarBadge
            boxSize="1.5em"
            bg={character.vote ? "dino.primary" : "dino.base1"}
            color="dino.text"
          >
            {character?.vote ? (
              <>
                {parseSecretVoteBasedOnRoomStatus(
                  status,
                  character.vote,
                  isRevealed
                )}
              </>
            ) : (
              "-"
            )}
          </AvatarBadge>
        </Avatar>
      </Flex>
    </>
  );
};
