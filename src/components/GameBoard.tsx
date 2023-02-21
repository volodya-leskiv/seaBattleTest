import React, {SetStateAction, useState} from "react";
import { GameContext } from "../context";
import { getMoves, random } from "../utils/Common";
import GameEnd from "./Game/GameEnd";
import Table from "./Game/Table";
import { CSSTransition } from "react-transition-group";
import {IGameBoard} from "../types/IGameBoard";

interface Props {
    board1: IGameBoard[];
    board2: IGameBoard[];
    setBoard1: React.Dispatch<SetStateAction<any>>;
    setBoard2: React.Dispatch<SetStateAction<any>>;
    difficulty: number;
}

const GameBoard:React.FC<Props> = ({ board1, board2, setBoard1, setBoard2, difficulty }) => {
    const [turn, setTurn] = useState(false);
    const [moves, setMoves] = useState(getMoves(board1, difficulty));
    const [winner, setWinner] = useState(null);

    const getMove = () => {
        console.log('Get Move')
        if (!moves.length) return null;

        const index = random(0, moves.length-1);
        const move = moves[index];
        moves.splice(index, 1);
        return move;
    }

    function removeMove([cellX, cellY]:number[]) {
        const index = moves.findIndex(([x, y]:any) => x === cellX && y === cellY);
        if (index >= 0) moves.splice(index, 1);
    }
    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={1000}
            classNames="page-holder"
        >
            <div className="page-holder">
                <GameContext.Provider value={{
                    turn,
                    setTurn,
                    getMove,
                    removeMove,
                    winner,
                    setWinner
                }}>
                    <Table classNames="no-events" type={0} board={board1}/>
                    <Table classNames={undefined} type={1} board={board2} {...{turn, setTurn}}/>
                    <GameEnd {...{setBoard1, setBoard2}}/>
                </GameContext.Provider>
            </div>
        </CSSTransition>
    );
}

export default GameBoard;
