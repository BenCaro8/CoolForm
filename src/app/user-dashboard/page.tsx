"use client";
import { FC } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { useAppDispatch } from "@/lib/store";
import { setQuestionnaire } from "@/lib/slices/sessionSlice";
import Section from "@/lib/components/Section";
import Title from "@/lib/components/Title";
import ScrollingSelection, {
  Selection,
} from "@/lib/components/ScrollingSelection";
import { page_GetAllQuestionnairesQuery } from "./__generated__/page_GetAllQuestionnairesQuery.graphql";

const getAllQuestionnairesQuery = graphql`
  query page_GetAllQuestionnairesQuery {
    getAllQuestionnairesQuery {
      id
      name
    }
  }
`;

const UserDashboard: FC = () => {
  const data = useLazyLoadQuery<page_GetAllQuestionnairesQuery>(
    getAllQuestionnairesQuery,
    {}
  );
  const dispatch = useAppDispatch();

  const selections: Selection[] | undefined =
    data.getAllQuestionnairesQuery?.map((questionnaire) => {
      return {
        children: (
          <Title size="small">
            {questionnaire?.name?.replace(/(?<=\b)\w/g, (match) =>
              match.toUpperCase()
            )}
          </Title>
        ),
        url: `/user-dashboard/${questionnaire?.name}`,
        onClick: () => {
          if (questionnaire) {
            dispatch(setQuestionnaire(questionnaire));
          }
        },
      } as Selection;
    });

  return (
    <Section flexCol>
      <Title>Select a Questionnaire:</Title>
      {selections && <ScrollingSelection selections={selections} />}
    </Section>
  );
};

export default UserDashboard;
