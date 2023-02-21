import React from "react";

interface Props {
  randomiseBoard: () => void;
  resetBoard: () => void;
}

const ModifyBoard: React.FC<Props> = ({randomiseBoard, resetBoard}) => {
  return (
    <div className="board-modify">
      <div onClick={() => randomiseBoard()} className="modify-text">Randomise</div>
      <div onClick={() => resetBoard()} className="modify-text">Reset board</div>
    </div>
  )
}

export default ModifyBoard;
