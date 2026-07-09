import { Flex, Text } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Codepen, Server } from "react-feather";

import { PlayerDataTeam } from "../../../model/PlayerData";
import { AuthService } from "../../../services/auth/auth.service";
import { NotificationsService } from "../../../services/notifications/notifications.service";
import { RoomsService } from "../../../services/rooms/rooms.service";
import { IconButton } from "../../atoms/icon-button/icon-button";

export const MenuTeam = () => {
  const { t } = useTranslation("common");

  const router = useRouter();
  const { id } = router.query;

  const [currentTeam, setCurrentTeam] = useState<PlayerDataTeam>();


  const handleTeamChange = async (team: PlayerDataTeam) => {


    try {
      await RoomsService.UPDATE_PLAYER({
        roomId: id,
        key: "team",
        value: team,
        player: AuthService.getUid()
      })
      setCurrentTeam(team);
    } catch (err: any) {
      NotificationsService.emitToast({
        message: err.message,
        state: "error"
      });

      setCurrentTeam(PlayerDataTeam.UNKNOWN);
    }
  };


  return (
    <>
      <Flex gap={3} alignItems="center" w="100%">
        <Text fontSize="sm" fontWeight={600}>
          {t("poker.actions.teams-action")}
        </Text>


        <IconButton
          onClick={() => handleTeamChange(PlayerDataTeam.FRONTEND)}
          color={currentTeam === PlayerDataTeam.FRONTEND ? "dino.secondary" : "dino.primary"}
          bg={currentTeam === PlayerDataTeam.FRONTEND ? "dino.primary" : "dino.secondary"}
          ariaLabel={t("poker.actions.team-one")}
          icon={<Server />}
        />
        <IconButton
          onClick={() => handleTeamChange(PlayerDataTeam.BACKEND)}
          color={currentTeam === PlayerDataTeam.BACKEND ? "dino.secondary" : "dino.primary"}
          bg={currentTeam === PlayerDataTeam.BACKEND ? "dino.primary" : "dino.secondary"}
          ariaLabel={t("poker.actions.team-two")}
          icon={<Codepen />}
        />
      </Flex>
    </>
  );
};
