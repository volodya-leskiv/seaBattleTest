import React, {useContext} from "react";
import {BoardContext} from "../../context";
import Ship from "../Ship";
import {IGameBoard} from "../../types/IGameBoard";

interface Props {
  ships: IGameBoard[][];
  setShips: any;
}

const ShipSelect: React.FC<Props> = ({ships}) => {
  const {dragStart} = useContext<any>(BoardContext);
  const holders = [];

  for (let i = ships.length - 1; i >= 0; i--) {
    const shipRow = ships[i];
    const shipArr = [];

    for (let b = 0; b < shipRow.length; b++) {
      const ship = shipRow[b];
      const elem = (
        <Ship
          key={b}
          shipPosition={ship}
          // @ts-ignore
          onMouseDown={(event: any) => dragStart(event, ship)}
          onTouchStart={(event: any) => dragStart(event, ship)}
          classNames={undefined}
        />
      );
      shipArr.push(elem);
    }

    holders.push(<div key={i} className="ship-holder">{shipArr}</div>);
  }
  return (
    <div className="ship-select">
      <h4>Drag to the field and click to rotate</h4>
      <div className="ship-wrapper">
        {holders}
      </div>
    </div>
  );
}
export default ShipSelect;
