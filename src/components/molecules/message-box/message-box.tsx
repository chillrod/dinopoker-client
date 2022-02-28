import { RefObject, useEffect, useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  Flex,
  Text,
} from "@chakra-ui/react";

import { Button } from "../../atoms/button/button";

import { emitter } from "../../../service/emitter/emitter";

interface FocusableElement {
  focus(options?: FocusOptions): void;
}

interface IMessageBox {
  onConfirm?: () => void;
  open?: boolean;
}

export const MessageBox = ({ onConfirm, open = false }: IMessageBox) => {
  const [isOpen, setIsOpen] = useState(open);

  const [currentMessage, setCurrentMessage] = useState("");

  const onClose = () => setIsOpen(false);

  const cancelRef: RefObject<FocusableElement> = useRef(null);

  useEffect(() => {
    emitter.on("EMIT_MESSAGEBOX", (message) => {
      setIsOpen(true);

      setCurrentMessage(message);
    });
  }, []);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogContent
        role="@dino-dialogcontent"
        bg="dino.base4"
        borderRadius="lg"
        p={2}
        px={8}
        maxWidth="fit-content"
      >
        <AlertDialogBody>
          <Text textAlign="center" as="h2" color="dino.text" fontWeight={500}>
            Are you sure you want to
            <br /> {currentMessage.length ? currentMessage : "ACTION"} ?
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter justifyContent="center">
          <Flex gap={2} justifyContent="center">
            {process.env.NODE_ENV !== "test" && (
              <Button onClick={onClose} ref={cancelRef}>
                Cancel
              </Button>
            )}
            <Button onClick={onConfirm} action="confirm">
              Confirm
            </Button>
          </Flex>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
