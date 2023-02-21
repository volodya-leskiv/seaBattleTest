import React, {useState, useEffect, SetStateAction} from "react";
import { BoardContext } from "../context";
import { canPlace, canRotate, getOverlapCells, removeShip, rotateShip } from "../utils/Board";
import { clamp, generateBoard, getSetupShips, map } from "../utils/Common";
import Select from "./Setup/Select";
import Table from "./Setup/Table";
import Button from "./UI/button/Button";
import { CSSTransition } from "react-transition-group";
import ModifyBoard from "./Setup/ModifyBoard";
import {IGameBoard} from "../types/IGameBoard";

interface Props {
    scale: any;
    setBoard1: React.Dispatch<SetStateAction<any>>;

}

const SetupBoard:React.FC<Props> = ({ scale, setBoard1 }) => {
    const [board, setBoard] = useState<any>([]);
    const [ships, setShips] = useState(getSetupShips());

    const [changes, setChanges] = useState(false);
    const [current, setCurrent] = useState<any>({target: null, x: 0, y: 0, ship: {id: -1, x: 0, y: 0, w: 0, h: 0, health: 0}, mapX: 0, mapY: 0});
    const [overlapCells, setOverlapCells] = useState<any>([]);
    const [isFailed, setIsFailed] = useState(false);

    useEffect(() => {
        function mousemove(event:any) {
            if (current.target === null) return;
            const { clientX, clientY } = event.touches && event.touches[0] || event;
            const x = (clientX - current.x) / scale;
            const y = (clientY - current.y) / scale;
            current.target.classList.add("no-events");
            current.target.style.transform = `translate(${x}px, ${y}px)`;
        }

        function mouseup() {
            if (current.target === null) return;
            current.target.style.transform = "";
            current.target.classList.remove("no-events");

            if (overlapCells.length) {
                const { id, x, y, w, h } = current.ship;

                if (x === -1 && y === -1) {
                    const value = Math.max(w, h);
                    const index = ships[value].findIndex(ship => ship.id === id);
                    ships[value].splice(index, 1);
                } else {
                    removeShip(board, current.ship);
                }

                const [startX, startY] = overlapCells[0];
                const copy = Object.assign({}, current.ship);
                copy.x = startX;
                copy.y = startY;
                board.push(copy);
            }

            setCurrent({target: null, x: 0, y: 0, ship: {id: -1, x: 0, y: 0, w: 0, h: 0, health: 0}, mapX: 0, mapY: 0});
            setOverlapCells([]);
        }

        window.addEventListener("mousemove", mousemove);
        window.addEventListener("mouseup", mouseup);

        window.addEventListener("touchmove", mousemove);
        window.addEventListener("touchend", mouseup);
        return () => {
            window.removeEventListener("mousemove", mousemove);
            window.removeEventListener("mouseup", mouseup);

            window.removeEventListener("touchmove", mousemove);
            window.removeEventListener("touchend", mouseup);
        }
    }, [current, overlapCells])

    function setCell(hoverX:number, hoverY:number) {
        if (current.target === null) return;
        const { w, h } = current.ship;
        const hoverPosition = [hoverX, hoverY, w, h];

        const cells = getOverlapCells([hoverX, hoverY], [w, h]);
        const isAble = canPlace(board, hoverPosition, current.ship);
        const isAbleToPlaceShip = isAble && cells.length === (Math.max(w, h) + 1);
        setOverlapCells(isAbleToPlaceShip ? cells : []);
        setChanges(!changes);
    }

    function dragStart(event:any, ship:IGameBoard) {
        const { w, h } = ship;
        const bounds = event.target.getBoundingClientRect();

        const offsetX = event.nativeEvent.offsetX || 0;
        const offsetY = event.nativeEvent.offsetY || 0;
        let mapX = Math.floor(map(offsetX * scale, 0, bounds.width, 0, w + 1));
        let mapY = Math.floor(map(offsetY * scale, 0, bounds.height, 0, h + 1));
        mapX = clamp(mapX, 0, Infinity);
        mapY = clamp(mapY, 0, Infinity);

        const width = (40 * (mapX + 1) - 20) * scale;
        const height = (40 * (mapY + 1) - 20) * scale;
        const posx = bounds.left + width;
        const posy = bounds.top + height;

        setCurrent({target: event.target, x: posx, y: posy, ship, mapX, mapY});
    }

    function rotate(event:any, ship:IGameBoard) {
        if (canRotate(board, ship)) {
            rotateShip(board, ship);
            setChanges(!changes);
            return;
        }

        if (!isFailed) {
            setIsFailed(true);

            event.target.classList.add("failed");
            setTimeout(() => {
                event.target.classList.remove("failed");
                setIsFailed(false);
            }, 400);
        }
    }

    function updateBoard() {
        setBoard1(board);
    }

    function randomiseBoard() {
        const newShips = generateBoard();
        setBoard(newShips);
        setShips([[], [], [], []]);
    }
    function resetBoard() {
        setShips(getSetupShips());
        setBoard([]);
    }
    return (
        <BoardContext.Provider value={{
            board,
            setCell,
            overlapCells,
            current,
            dragStart,
            rotate
        }}>
            <CSSTransition
                in={true}
                appear={true}
                timeout={1000}
                classNames="page-holder"
            >
                <div className="page-holder">
                    <Select
                        ships={ships}
                        setShips={setShips}
                    />
                    <Table></Table>
                    <div className="right-wrap">
                        <ModifyBoard {...{randomiseBoard, resetBoard}}/>
                        <Button
                            className="default-button shadowed"
                            disabled={board.length !== 10}
                            // @ts-ignore
                            onClick={board.length === 10 ? () => updateBoard() : null}
                        >
                            START GAME
                        </Button>
                    </div>

                </div>
            </CSSTransition>
        </BoardContext.Provider>
    );
}
export default SetupBoard;
