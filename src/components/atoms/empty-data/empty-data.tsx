import { Box, Text } from "@chakra-ui/react";

import { useTranslation } from "react-i18next";

interface IEmptyData {
  data: string;
}
export const EmptyData = ({ data }: IEmptyData) => {
  const { t } = useTranslation();

  return (
    <>
      <Box p={3}>
        <Text textAlign="center">🤔</Text>
        <Text textAlign="center">
          {t("components.no-data", { messages: data })}
        </Text>
      </Box>
    </>
  );
};
