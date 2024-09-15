"use client";
import { FC, ReactNode } from "react";
import styles from "./styles/Button.module.scss";
import classNames from "classnames";

type Props = {
  children: ReactNode;
  handleClick: () => void;
  disabled?: boolean;
};

const Button: FC<Props> = ({ children, handleClick, disabled }) => {
  return (
    <button
      onClick={handleClick}
      className={classNames(styles.button, {
        [styles.enabledButton]: !disabled,
        [styles.disabledButton]: disabled,
      })}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
