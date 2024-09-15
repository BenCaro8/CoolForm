"use client";
import { ChangeEvent, FC, KeyboardEvent } from "react";
import { Icon, getIcon } from "../utils/svgs";
import styles from "./styles/TextInput.module.scss";
import classNames from "classnames";

type Props = {
  value: string;
  handleOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleEnterPress?: () => void;
  placeholder?: string;
  textColor?: string;
  icon?: Icon;
  password?: boolean;
};

const TextInput: FC<Props> = ({
  value,
  handleOnChange,
  handleEnterPress: handleEnterPressParam,
  placeholder,
  textColor,
  icon: iconParam,
  password = false,
}) => {
  const icon = iconParam ? getIcon(iconParam, styles.svg) : undefined;

  const handleEnterPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && handleEnterPressParam) {
      handleEnterPressParam();
    }
  };

  return (
    <div
      className={classNames(styles.inputWrapper, {
        [styles.iconPadding]: !!icon,
      })}
    >
      <input
        type={password ? "password" : "text"}
        onChange={handleOnChange}
        onKeyDown={handleEnterPress}
        value={value}
        style={{ color: textColor }}
        placeholder={placeholder}
        className={styles.input}
      />
      {icon}
    </div>
  );
};

export default TextInput;
