"use client";
import { FC, ReactNode } from "react";
import styles from "./styles/ScrollingSelection.module.scss";
import Link from "next/link";

export type Selection = {
  children: ReactNode;
  onClick?: () => {};
  url?: string;
};

type Props = {
  selections: Selection[];
};

const ScrollingSelection: FC<Props> = ({ selections }) => {
  return (
    <div className={styles.scrollContainer}>
      {selections.map((selection, index) => {
        if (selection?.url) {
          return (
            <Link
              key={index}
              className={styles.selectionItem}
              role="button"
              tabIndex={0}
              href={selection.url}
              onClick={selection.onClick}
            >
              {selection.children}
            </Link>
          );
        } else {
          return (
            <a
              key={index}
              className={styles.selectionItem}
              role="button"
              tabIndex={0}
              onClick={selection.onClick}
            >
              {selection.children}
            </a>
          );
        }
      })}
    </div>
  );
};

export default ScrollingSelection;
