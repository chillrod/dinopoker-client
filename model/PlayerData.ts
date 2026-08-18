import { CharacterList } from "../config/characters";

export interface IPlayerData {
  raiseHand?: boolean;
  character?: number;
  id?: string;
  name?: string;
  vote?: number;
  room?: string;
  team?: PlayerDataTeam;
}

export enum PlayerDataTeam {
  FRONTEND = 1,
  BACKEND = 2,
  UNKNOWN = 3,
  FULLSTACK = 4,
}

export const InitializePlayerData = (player: IPlayerData): IPlayerData => ({
  raiseHand: false,
  character: Math.floor(Math.random() * CharacterList.length),
  name: "",
  vote: 0,
  room: "",
  team: PlayerDataTeam.UNKNOWN,
  ...player,
});
