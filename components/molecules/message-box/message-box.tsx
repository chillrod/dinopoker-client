import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  Box,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import { RefObject, useEffect, useRef, useState } from "react";

import { emitter } from "../../../services/emitter/emitter";
import { Events } from "../../../services/emitter/emitter-dto";
import { NotificationsService } from "../../../services/notifications/notifications.service";
import { Button } from "../../atoms/button/button";

interface FocusableElement {
  focus(options?: FocusOptions): void;
}

interface IMessageBox {
  open?: boolean;
}

export const MessageBox = ({ open = false }: IMessageBox) => {
  const { t } = useTranslation("common");

  const [isOpen, setIsOpen] = useState(open);
  const [overlayClick, setOverlayClick] = useState<boolean | undefined>(true);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentFunc, setCurrentFunc] = useState<keyof Events | null>(null);
  const [userOnClose, setUserOnClose] = useState<() => void>();
  const [loading, setLoading] = useState(false);

  const [children, setCurrentChildren] = useState<React.ReactElement>();

  const cancelRef: RefObject<FocusableElement> = useRef(null);

  useEffect(() => {
    emitter.on(
      "EMIT_MESSAGEBOX",
      ({ message, func, children, onClose, persistent }) => {
        setIsOpen(true);

        setOverlayClick(!persistent);

        setCurrentMessage(message);

        if (func) {
          setCurrentFunc(func);
        }

        setUserOnClose(() => onClose);

        setCurrentChildren(children);
      }
    );

    emitter.on("EMIT_MESSAGEBOX_LOADING", (data) => {
      setLoading(data);
    });

    emitter.on("EMIT_MESSAGEBOX_CLOSE", () => {
      setIsOpen(false);
    });

    return () => {
      emitter.off("EMIT_MESSAGEBOX");
      emitter.off("EMIT_MESSAGEBOX_LOADING");
    };
  }, []);

  const handleActionConfirm = () => {
    if (currentFunc) {
      NotificationsService.emitConfirm({ func: currentFunc });
    } else {
      setIsOpen(false);
    }
  };

  return (
    <Box
      bg="dino.base5"
      {...(isOpen
        ? {
            opacity: "0.6",
            position: "absolute",
            h: "100%",
            w: "100vw",
            zIndex: "2",
          }
        : {})}
    >
      <AlertDialog
        closeOnOverlayClick={overlayClick}
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
        motionPreset="slideInBottom"
        isCentered
      >
        <AlertDialogContent
          boxShadow="xl"
          role="@dino-dialogcontent"
          bg="dino.base3"
          p={12}
          px={6}
        >
          <AlertDialogBody>
            {children && <>{children}</>}
            {!children && (
              <Text
                textAlign="center"
                as="h2"
                color="dino.text"
                fontWeight={500}
              >
                {t("components.are-you-sure-you-want-to")}
                <br /> {currentMessage.length ? currentMessage : "ACTION"} ?
              </Text>
            )}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Grid gridTemplateColumns="1fr 1fr">
              <GridItem justifySelf="start">
                <Button
                  loading={loading}
                  bg="dino.secondary"
                  onClick={
                    userOnClose
                      ? () => [userOnClose(), setIsOpen(false)]
                      : () => setIsOpen(false)
                  }
                  forwardRef={cancelRef}
                >
                  {t("components.cancel")}
                </Button>
              </GridItem>
              <GridItem justifySelf="end">
                <Button
                  loading={loading}
                  onClick={() => handleActionConfirm()}
                  bg="dino.primary"
                >
                  {t("components.confirm")}
                </Button>
              </GridItem>
            </Grid>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};
