"use client";
import { FC, useState, Suspense } from "react";
import { graphql, useLazyLoadQuery, useQueryLoader } from "react-relay";
import { page_GetAllUsersQuery } from "./__generated__/page_GetAllUsersQuery.graphql";
import { page_GetUserAnswersQuery } from "./__generated__/page_GetUserAnswersQuery.graphql";
import Section from "@/lib/components/Section";
import Title from "@/lib/components/Title";
import ScrollingSelection, {
  Selection,
} from "@/lib/components/ScrollingSelection";
import Button from "@/lib/components/Button";
import UserAnswers from "@/lib/components/UserAnswers";
import Modal from "@/lib/components/Modal";

const getAllUsers = graphql`
  query page_GetAllUsersQuery {
    getAllUsers {
      id
      username
      role
    }
  }
`;

const getUserAnswersQuery = graphql`
  query page_GetUserAnswersQuery($username: String!) {
    getAllUserAnswersQuery(username: $username) {
      question_id
      answer
    }
    getAllJunctions {
      question_id
      questionnaire_id
    }
    getAllQuestionnairesQuery {
      id
      name
    }
  }
`;

const AdminDashboard: FC = () => {
  const data = useLazyLoadQuery<page_GetAllUsersQuery>(getAllUsers, {});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [queryReference, loadAnswersQuery, disposeQuery] =
    useQueryLoader<page_GetUserAnswersQuery>(getUserAnswersQuery);

  const selections: Selection[] =
    data.getAllUsers
      ?.filter((user) => user?.username)
      .map((user) => ({
        children: (
          <Section>
            <Title size="small">{user!.username}</Title>
            <div className="relative ml-auto"></div>
          </Section>
        ),
        onClick: () => {
          setSelectedUser(user!.username);
          loadAnswersQuery({ username: user!.username });
        },
      })) || [];

  if (!selectedUser || !queryReference) {
    return (
      <Section flexCol>
        <Title>Select a User:</Title>
        {selections.length > 0 && (
          <ScrollingSelection selections={selections} />
        )}
      </Section>
    );
  }

  return (
    <Section flexCol>
      <div className="mb-4 ml-4">
        <Button
          handleClick={() => {
            setSelectedUser(null);
            disposeQuery();
          }}
        >
          Back
        </Button>
      </div>
      <Suspense fallback={<div>Loading user answers...</div>}>
        <Modal
          isOpen={!!selectedUser}
          onClose={() => {
            setSelectedUser(null);
            disposeQuery();
          }}
        >
          <Title color="primary-bg-color">{selectedUser}'s Answers</Title>
          <UserAnswers queryReference={queryReference} />
        </Modal>
      </Suspense>
    </Section>
  );
};

export default AdminDashboard;
