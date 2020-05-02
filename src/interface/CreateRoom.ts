import { ICard } from "./Card";
export interface ICreateRoom {
  roomId: string;
  playerId: string;
  deck: ICard[];
  playerHand: ICard[];
  dealerHand: ICard[];
  roomStatus: number;
}
