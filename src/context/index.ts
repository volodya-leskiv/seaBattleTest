import {createContext} from "react";
import {IBoardContext, IGamecontext} from "../types/IGameBoard";

export const BoardContext = createContext<IBoardContext | null>(null);
export const GameContext = createContext<IGamecontext | null>(null);
