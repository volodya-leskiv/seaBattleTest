import React from "react";

interface Props {
    shipPosition: any;
    classNames: any;
}

const Ship:React.FC<Props> = ({ shipPosition, classNames, ...args }) => {
    const { w, h } = shipPosition;
    const classList = ["ship", `ship-${Math.max(w+1, h+1)}-${w > h ? "hor" : "vert"}`];
    if (classNames && classNames.length) classList.push(...classNames.split(" "));

    return (
        <div
            className={classList.join(" ")}
            {...args}
        ></div>
    );
}
export default Ship;
