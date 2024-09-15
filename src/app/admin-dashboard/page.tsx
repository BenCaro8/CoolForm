"use client";
import { FC, useEffect } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { useAppSelector } from "@/lib/store";
import Section from "@/lib/components/Section";
import Title from "@/lib/components/Title";
import { page_GetAllUsersQuery } from "./__generated__/page_GetAllUsersQuery.graphql";
import { redirect } from "next/navigation";
import ScrollingSelection, {
  Selection,
} from "@/lib/components/ScrollingSelection";

const getAllUsers = graphql`
  query page_GetAllUsersQuery {
    getAllUsers {
      id
      username
      role
    }
  }
`;

const AdminDashboard: FC = () => {
  const user = useAppSelector((state) => state.session.user);
  const data = useLazyLoadQuery<page_GetAllUsersQuery>(getAllUsers, {});

  const selections: Selection[] | undefined = data.getAllUsers?.map((user) => {
    return {
      children: <Title size="small">{user?.username}</Title>,
      url: `/user-dashboard/`,
      onClick: () => {},
    } as Selection;
  });

  useEffect(() => {
    if (!user) {
      redirect("/");
    }
  }, [user]);

  return (
    <Section flexCol>
      <Title>Select a User:</Title>
      {selections && <ScrollingSelection selections={selections} />}
    </Section>
  );
};

export default AdminDashboard;
