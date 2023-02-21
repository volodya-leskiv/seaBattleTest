import React from "react";
import {IGameBoard} from "../../types/IGameBoard";


interface Props {
  type: number;
  shipList: IGameBoard[][];
}

const ShipList: React.FC<Props> = ({type, shipList}) => {

  const generateKey = (pre: any) => {
    return `${ pre }_${ new Date().getTime() }`;
  }


  return (
    <div className={"shipList-container " + (type === 0 ? "align-left" : "align-right")}>
      {
        shipList.map((ships, index) => {
          return (
            <div key={index} className="list-holder">
              {
                ships.map((ship, index) => {
                  const shipNames = [
                    "ship-preview",
                    "ship-" + Math.max(ship.w, ship.h),
                    ship.health > 0 ? "ship-blue" : "ship-red"
                  ];
                  return (
                    <div key={index} className={shipNames.join(" ")}></div>
                  );
                })
              }
            </div>
          );
        })
      }
    </div>
  );
}
export default ShipList;
