import React from "react";
import Classes from "./Button.module.css";

interface Props {
    children: any;
    disabled: boolean;
    className: any;
}

const Button:React.FC<Props> = ({ children, disabled, className, ...args })=> {
    const classNames = className.split(" ");
    const classList = [Classes[classNames.splice(0, 1)], ...classNames];
    if (disabled) {
        classList.push(Classes.disabled);
    }
    return (
        <button
            className={classList.join(" ")}
            {...args}
        >
            {children}
        </button>
    );
}

export default Button;
