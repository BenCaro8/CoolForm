"use client";
import { FC, useEffect, ReactNode } from "react";
import { useAppSelector } from "@/lib/store";
import { redirect } from "next/navigation";

type Props = {
  children: ReactNode;
};

const UserDashboardLayout: FC<Props> = ({ children }) => {
  const user = useAppSelector((state) => state.session.user);

  useEffect(() => {
    if (!user) {
      redirect("/");
    }
  }, [user]);

  return <>{children}</>;
};

export default UserDashboardLayout;
