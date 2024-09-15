"use client";
import { FC, ReactNode } from "react";
import styles from "./styles/ScrollingSelection.module.scss";
import Link from "next/link";

export type Selection = {
  children: ReactNode;
  url: string;
  onClick?: () => {};
};

type Props = {
  selections: Selection[];
};

const ScrollingSelection: FC<Props> = ({ selections }) => {
  return (
    <div className={styles.scrollContainer}>
      {selections.map((selection, index) => (
        <Link
          key={index}
          className={styles.selectionItem}
          role="button"
          tabIndex={0}
          href={selection?.url}
          onClick={selection.onClick}
        >
          {selection.children}
        </Link>
      ))}
    </div>
  );
};

export default ScrollingSelection;
