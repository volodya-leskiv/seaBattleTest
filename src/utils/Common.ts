import {canPlace, equalsArray, getBoundsCells, getOverlapCells} from "./Board";
import {IGameBoard} from "../types/IGameBoard";

export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getScale([width, height]: number[]) {
  return Math.min(width / 1280, height / 720);
}

export function getChar(code: number) {
  return String.fromCharCode(97 + code).toUpperCase();
}

export function map(value: number, start1: number, stop1: number, start2: number, stop2: number) {
  return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getMoves(board?: IGameBoard[], difficulty?: number) {
  const moves = [];
  for (let i = 0; i < 10; i++) {
    for (let b = 0; b < 10; b++) {
      moves.push([i, b]);
    }
  }
  if (board === undefined && difficulty === undefined) return moves;

  const outputMoves = [];
  const cells = board ? board : [].map((ship: number | any) => getOverlapCells([ship.x, ship.y], [ship.w, ship.h])).flat();
  const boundCells = board ? board : [].map(ship => getBoundsCells(ship)).flat();

  if (difficulty === 0) outputMoves.push(...moves);
  if (difficulty === 1 || difficulty === 2) {
    const type = {
      1: 0,
      2: 20
    }
    outputMoves.push(...cells);
    for (let i = boundCells.length - 1; i >= type[difficulty]; i -= 1) {
      const move = boundCells[i];
      const hasRepeat = outputMoves.find((smove) => equalsArray(smove, move));

      if (!hasRepeat) {
        outputMoves.push(move);
      }
      boundCells.splice(i, 1);
    }
  }
  return outputMoves;
}

export function getSetupShips() {
  return [
    [
      {id: 6, x: -1, y: -1, w: 0, h: 0, health: 1},
      {id: 7, x: -1, y: -1, w: 0, h: 0, health: 1},
      {id: 8, x: -1, y: -1, w: 0, h: 0, health: 1},
      {id: 9, x: -1, y: -1, w: 0, h: 0, health: 1}
    ],
    [
      {id: 3, x: -1, y: -1, w: 1, h: 0, health: 2},
      {id: 4, x: -1, y: -1, w: 1, h: 0, health: 2},
      {id: 5, x: -1, y: -1, w: 1, h: 0, health: 2}
    ],
    [
      {id: 1, x: -1, y: -1, w: 2, h: 0, health: 3},
      {id: 2, x: -1, y: -1, w: 2, h: 0, health: 3}
    ],
    [
      {id: 0, x: -1, y: -1, w: 3, h: 0, health: 4}
    ]
  ];
}

export function generateBoard() {
  const defaultShips = getSetupShips().flat();

  const moves = getMoves();

  function removeMoves(movesToDelete: number[][]) {
    for (const [x, y] of movesToDelete) {
      const index = moves.findIndex(([posX, posY]: any) => posX === x && posY === y);
      if (index >= 0) moves.splice(index, 1);
    }
  }

  const newShips: any = [];

  while (newShips.length !== 10 && moves.length && defaultShips.length) {
    const index = random(0, moves.length - 1);
    const [x, y]: any = moves[index];
    const shipIndex = defaultShips.length - 1;
    const ship = defaultShips[shipIndex];

    // @ts-ignore
    function tryBoth(w: number, h: number) {
      const cells = getOverlapCells([x, y], [w, h]);
      const isAble = canPlace(newShips, [x, y, w, h]);
      const isAbleToPlaceShip = isAble && cells.length === (Math.max(w, h) + 1);
      if (isAbleToPlaceShip) {
        ship.x = x;
        ship.y = y;
        ship.w = w;
        ship.h = h;

        const boundCells = getBoundsCells(ship);
        removeMoves(boundCells);
        removeMoves(cells);
        defaultShips.splice(shipIndex, 1);
        newShips.push(ship);
        return true;
      }
      return false;
    }

    const tried1 = tryBoth(ship.w, ship.h);
    if (!tried1) {
      tryBoth(ship.h, ship.w);
    }
  }
  return newShips;
}
