import { Flex, Text } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useState } from "react";
import { AlertCircle } from "react-feather";

import { AuthService } from "../../../services/auth/auth.service";
import { NotificationsService } from "../../../services/notifications/notifications.service";
import { RoomsService } from "../../../services/rooms/rooms.service";
import { IconButton } from "../../atoms/icon-button/icon-button";

export const MenuRaiseHand = () => {
  const { t } = useTranslation("common");

  const router = useRouter();

  const { id } = router.query;

  const [isRaisingHand, setIsRaisingHand] = useState(true);

  const handleRaiseHand = async (raisingHand: boolean) => {
    try {
      RoomsService.UPDATE_PLAYER({
        roomId: id,
        key: "raiseHand",
        value: !raisingHand,
        player: AuthService.getUid(),
      });
    } catch (err: any) {
      NotificationsService.emitToast(err.message);
    }
  };

  const returnBg = (raisingHand: boolean) => {
    if (raisingHand) return "dino.secondary";

    return "dino.primary";
  };

  const returnColor = () => {
    return isRaisingHand ? "dino.primary" : "dino.secondary";
  };

  return (
    <>
      <Flex w="100%" gap={3} alignItems="center">
        <Text fontSize="sm" fontWeight={600}>
          {t("poker.actions.room-action")}
        </Text>
        <IconButton
          onClick={() => [
            setIsRaisingHand(!isRaisingHand),
            handleRaiseHand(!isRaisingHand),
          ]}
          color={returnColor()}
          bg={returnBg(isRaisingHand)}
          ariaLabel={t("poker.actions.raise-hand")}
          icon={<AlertCircle />}
        />
      </Flex>
    </>
  );
};
