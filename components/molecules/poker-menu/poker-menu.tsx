import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  MenuButton,
  Menu as MenuChakra,
  MenuList,
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import { Menu } from "react-feather";

import { MenuRaiseHand } from "../../atoms/menu-raisehand/menu-raisehand";
import { MenuTeam } from "../../atoms/menu-team/menu-team";

export const PokerMenu = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <Grid borderRadius="md">
        <Flex gap={7}>
          {[<MenuTeam key={1} />].map((Component, id) => (
            <div key={id}>
              <Flex>{Component}</Flex>
            </div>
          ))}
        </Flex>
      </Grid>
      {/* <Grid display={["block", "block", "none"]}>
        <MenuChakra>
          <MenuButton
            as={Button}
            rightIcon={<Menu />}
            color="dino.primary"

          >
          </MenuButton>
          <MenuList bg="dino.base5">
            {[<MenuTeam key={1} />].map(
              (Component, id) => (
                <Box key={id} mb={2} p={4}>
                  <Flex>{Component}</Flex>
                </Box>
              )
            )}
          </MenuList>
        </MenuChakra>
      </Grid> */}
    </>
  );
};
