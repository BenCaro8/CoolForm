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

  const filteredJunctions = questionJunctionData.getAllJunctions?.filter(
    (junction) => junction?.questionnaire_id.toString() === questionnaireId
  );

  const currentQuestionIds =
    filteredJunctions?.map((junction) => junction!.question_id.toString()) ||
    [];

  const filteredAnswers = Object.entries(answers)
    .filter(([questionId]) => currentQuestionIds.includes(questionId))
    .map(([questionId, answer]) => ({
      questionId,
      answer: Array.isArray(answer) ? answer.join(",") : answer,
    }));

  const handleSubmit = useCallback(() => {
    if (!user) {
      return;
    }

    const input = {
      username: user.username,
      answers: filteredAnswers,
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

  const isDisabled =
    isMutationInFlight ||
    Object.entries(filteredAnswers).some(([_, answerObj]) => {
      if (answerObj && answerObj?.answer) {
        Array.isArray(answerObj.answer)
          ? answerObj.answer.length === 0
          : answerObj.answer.trim().length === 0;
      }
    });

  const sortedJunctions = filteredJunctions?.toSorted((a, b) => {
    return (a.priority || 0) - (b.priority || 0);
  });

  const sortedQuestions = sortedJunctions?.map((junction, index) => {
    return questionJunctionData.getAllQuestions?.find(
      (question) => question.id === junction.question_id.toString()
    );
  });

  return (
    <Section flexCol>
      <Title center>{questionnaireTitle}</Title>
      {sortedQuestions?.map((questionParam, index) => {
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
      <Button handleClick={handleSubmit} disabled={isDisabled} right>
        <Title size="small">Submit</Title>
      </Button>
    </Section>
  );
};

export default Questionnaire;
