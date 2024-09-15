"use client";
import { FC, useRef, ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store";

type Props = { children: ReactNode };

const StoreProvider: FC<Props> = ({ children }) => {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
