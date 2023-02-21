import React, {SetStateAction, useContext} from "react";
import {GameContext} from "../../context";
import {generateBoard} from "../../utils/Common";
import {IGameBoard, IGamecontext} from "../../types/IGameBoard";

interface Props {
  setBoard1: React.Dispatch<SetStateAction<any>>;
  setBoard2: React.Dispatch<SetStateAction<any>>;
}

const GameEnd: React.FC<Props> = ({setBoard1, setBoard2}) => {
  const {winner} = useContext<any>(GameContext);

  function resetGame() {
    setBoard1([]);
    setBoard2(generateBoard());
  }

  return (
    <>
      {
        winner !== null && (
          <div onClick={resetGame} className="game-end-container">
            <h3 className="game-end-header shadowed">{winner === 0 ? "You lost" : "You won"}</h3>
            <h5 className="shadowed-tiny">Click to start a new game!</h5>
          </div>
        )
      }
    </>
  );
}

export default GameEnd;
