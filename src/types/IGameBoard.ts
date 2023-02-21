import React, {SetStateAction} from "react";

export interface IGameBoard {
  h: number;
  health: number;
  id: number;
  w: number;
  x: number;
  y: number;
}

export interface IGamecontext {
  turn: boolean | null;
  setTurn: React.Dispatch<SetStateAction<any>>;
  winner: boolean | null | number;
  setWinner: React.Dispatch<SetStateAction<any>>;
  getMove?: any;
  removeMove?: any;
}

export interface IBoardContext {
  board: IGameBoard;
  setCell: any;
  overlapCells: any;
  current: any;
  dragStart: any;
  rotate: any;
}
