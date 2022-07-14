import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { DinoPoker } from "../../atoms/dinopoker";
import { MenuChangeLanguage } from "../menu-changelanguage/menu-changelanguage";
import { PokerMenu } from "../poker-menu/poker-menu";

export const Nav = () => {
  const router = useRouter();

  const { id } = router.query;

  return (
    <Box as="nav" height="auto" px={6} pt={6}>
      <Grid templateColumns="1fr auto" alignItems="center">
        <GridItem>
          <Flex justifyContent="space-between" alignItems="center">
            <DinoPoker small />
            {!id && <MenuChangeLanguage />}
          </Flex>
        </GridItem>
        {id && (
          <GridItem justifySelf="end">
            <PokerMenu />
          </GridItem>
        )}
      </Grid>
    </Box>
  );
};
