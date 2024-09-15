"use client";
import { FC, useCallback } from "react";
import { graphql, useLazyLoadQuery, useMutation } from "react-relay";
import { useAppSelector } from "@/lib/store";
import { useRouter } from "next/navigation";
import Section from "@/lib/components/Section";
import Title from "@/lib/components/Title";
import { Question } from "@/lib/utils/types";
import MultiChoiceQuestion from "@/lib/components/MultiChoiceQuestion";
import InputQuestion from "@/lib/components/InputQuestion";
import Button from "@/lib/components/Button";
import { page_GetAllQuestionsAndJunctionsQuery } from "./__generated__/page_GetAllQuestionsAndJunctionsQuery.graphql";
import { page_SubmitAnswersMutation } from "./__generated__/page_SubmitAnswersMutation.graphql";
import styles from "./styles/page.module.scss";

type Props = {
  params: {
    questionnaire: string;
  };
};

const getAllQuestionsAndJunctions = graphql`
  query page_GetAllQuestionsAndJunctionsQuery {
    getAllQuestions {
      id
      question
    }
    getAllJunctions {
      id
      question_id
      questionnaire_id
      priority
    }
  }
`;

const submitAnswersMutation = graphql`
  mutation page_SubmitAnswersMutation($input: SubmitAnswersInput!) {
    submitAnswers(input: $input) {
      success
      message
    }
  }
`;

const Questionnaire: FC<Props> = ({ params }) => {
  const router = useRouter();
  const user = useAppSelector((state) => state.session.user);
  const answers = useAppSelector((state) => state.session.answers);
  const questionnaireId = useAppSelector(
    (state) => state.session.questionnaireId
  );
  const questionJunctionData =
    useLazyLoadQuery<page_GetAllQuestionsAndJunctionsQuery>(
      getAllQuestionsAndJunctions,
      {}
    );

  const questionnaireTitle = params.questionnaire.replace(
    /(?<=\b)\w/g,
    (match) => match.toUpperCase()
  );
  const [commit, isMutationInFlight] = useMutation<page_SubmitAnswersMutation>(
    submitAnswersMutation
  );

  const handleSubmit = useCallback(() => {
    if (!user) {
      return;
    }

    const input = {
      username: user.username,
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer: Array.isArray(answer) ? answer.join(",") : answer,
      })),
    };

    commit({
      variables: { input },
      onCompleted: (response, errors) => {
        if (response.submitAnswers?.success) {
          router.push("/user-dashboard");
        } else {
          console.log(errors);
        }
      },
      onError: (err) => {
        console.log(err);
      },
    });
  }, [answers]);

  const filteredJunctions = questionJunctionData?.getAllJunctions?.filter(
    (junction) => junction?.questionnaire_id.toString() === questionnaireId
  );

  return (
    <Section center flexCol>
      <Title>{questionnaireTitle}</Title>
      {questionJunctionData?.getAllQuestions?.map((questionParam, index) => {
        const question = questionParam?.question as Question;
        const id = questionParam?.id;
        if (
          !id ||
          !filteredJunctions?.some(
            (junction) => junction?.question_id.toString() === id
          )
        )
          return;
        if (question.type === "mcq") {
          return (
            <div className={styles.questionWrapper} key={index}>
              <MultiChoiceQuestion question={question} id={id} />
            </div>
          );
        } else if (question.type === "input") {
          return (
            <div className={styles.questionWrapper} key={index}>
              <InputQuestion question={question} id={id} />
            </div>
          );
        }
      })}
      <Button handleClick={handleSubmit} disabled={isMutationInFlight}>
        <Title size="small">Submit</Title>
      </Button>
    </Section>
  );
};

export default Questionnaire;
