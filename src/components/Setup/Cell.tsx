import React, {SetStateAction, useContext} from "react";
import {BoardContext} from "../../context";
import {IGameBoard} from "../../types/IGameBoard";

interface Props {
  children: any;
  x: number;
  y: number;
}

const Cell: React.FC<Props> = ({children, x, y}) => {
  const {setCell, overlapCells, current} = useContext<any>(BoardContext);
  const classList = ["cell"];

  const isTargeting = overlapCells.length && overlapCells.some(([x1, y1]: number[]) => x1 === x && y1 === y);
  if (isTargeting) classList.push("green");
  return (
    <td
      className={classList.join(" ")}
      onMouseEnter={() => setCell(x - current.mapX, y - current.mapY)}
    >
      {children}
    </td>
  );
}
export default Cell;
