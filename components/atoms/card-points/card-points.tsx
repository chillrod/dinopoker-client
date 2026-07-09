import { Box, Button, Grid, GridItem, Text } from "@chakra-ui/react";

interface ICardPoints {
  point: number;
  selected: boolean;
  onClick?: (point: number) => void;
  disabled?: boolean;
}
export const CardPoints = ({
  selected,
  point,
  onClick,
  disabled,
}: ICardPoints) => {
  return (
    <Button
      _hover={
        disabled
          ? undefined
          : {
              bg: selected ? "dino.primary" : "dino.base2",
              transform: "translateY(-6px)",
              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.35)",
            }
      }
      transition="all 0.15s ease"
      disabled={disabled}
      role="@dino-cardpoint"
      onClick={() => onClick && onClick(point)}
      size="sm"
      borderRadius="xl"
      border="1px solid rgba(255, 255, 255, 0.06)"
      boxShadow={
        selected
          ? "0 8px 20px rgba(119, 85, 204, 0.45)"
          : "0 4px 12px rgba(0, 0, 0, 0.25)"
      }
      bg={selected ? "dino.primary" : "dino.base3"}
      width={["auto", "6em"]}
      height={["9em", "8em"]}
    >
      <Grid gap={2} p={4}>
        <GridItem justifySelf="start">
          <Box>
            <Text as="span">{point}</Text>
          </Box>
        </GridItem>
        <GridItem>
          <Box
            sx={{
              display: "grid",
            }}
            bg="dino.base1"
            width="5ch"
            h="5ch"
            borderRadius="full"
          >
            <Text
              fontSize="3xl"
              color="dino.text"
              fontWeight={600}
              alignSelf="center"
            >
              {point}
            </Text>
          </Box>
        </GridItem>
        <GridItem justifySelf="end">
          <Box
            sx={{
              transform: "rotate(-180deg)",
            }}
          >
            <Text as="span">{point}</Text>
          </Box>
        </GridItem>
      </Grid>
    </Button>
  );
};
