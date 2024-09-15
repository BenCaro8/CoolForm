import { FC, ReactNode } from "react";
import { ThemeColor } from "../utils/types";
import Title from "./Title";
import styles from "./styles/Card.module.scss";
import classNames from "classnames";

type BackgroundColor = ThemeColor | "white" | "none";

type Props = {
  children?: ReactNode;
  title?: string;
  link?: string;
  center?: boolean;
  color?: string;
  backgroundColor?: BackgroundColor;
  gradient?: BackgroundColor;
  borderColor?: ThemeColor | "white";
  borderWidth?: number;
  borderRadius?: number;
};

const Card: FC<Props> = ({
  children,
  title,
  center = false,
  color = "white",
  backgroundColor: backgroundColorParam = "none",
  gradient: gradientParam,
  borderColor,
  borderWidth = 3,
  borderRadius = 0,
}) => {
  let backgroundColor =
    !backgroundColorParam || backgroundColorParam === "white"
      ? backgroundColorParam
      : `var(--${backgroundColorParam})`;

  if (gradientParam) {
    const gradient =
      gradientParam === "white" ? gradientParam : `var(--${gradientParam})`;
    backgroundColor = `linear-gradient(45deg, ${backgroundColor}, ${gradient})`;
  }

  return (
    <div
      className={styles.cardWrapper}
      style={{
        color,
        background: backgroundColor,
        borderColor:
          borderColor === "white" ? borderColor : `var(--${borderColor})`,
        borderWidth: `${borderWidth}px`,
        borderRadius: `${borderRadius}px`,
      }}
    >
      <div
        className={classNames(styles.content, {
          [styles.center]: center,
        })}
      >
        {title && (
          <>
            <Title size="medium">{title}</Title>
            <div
              className={styles.divisionBar}
              style={{ backgroundColor: color }}
            />
          </>
        )}
        {children}
      </div>
    </div>
  );
};

export default Card;
