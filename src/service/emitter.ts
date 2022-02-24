import { ToastId } from "@chakra-ui/react";
import mitt, { Emitter } from "mitt";
import { character } from "../components/atoms/character-card/hooks";
import { IOption } from "../components/atoms/select/select";

export type Events = {
  //this is just for test
  ADD_COUNT: number;
  //

  CHARACTER_NAME: string;
  SELECTED_CHARACTER?: character;
  SELECTED_CONFIGURATION?: IOption;

  CREATE_ROOM: { name?: string; pointSystem?: number[]; character?: character };

  CHANGE_ROOM_CONFIG: { point: string; rounds: number };
  JOIN_ROOM: () => void;
  DISCONNECT: () => void;
  LEAVE: () => void;
  SHARE: () => void;

  CONFIRM_ACTION: () => void;
  CANCEL_ACTION: () => void;
  EMIT_TOAST: string;
  EMIT_MESSAGEBOX: (message: string) => void;

  ERROR: string;
  SUCCESS: string;
  LOADING: boolean;

  VOTE_START: () => void;
  VOTE_SELECT: (point: number) => void;
  VOTE_REVEAL: () => void;
  VOTE_END: () => void;
};

export const emitter: Emitter<Events> = mitt<Events>();
