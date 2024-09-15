"use client";
import { ChangeEvent, FC, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store";
import { graphql, useLazyLoadQuery } from "react-relay";
import { Answer, setAnswer } from "../slices/sessionSlice";
import { Question } from "../utils/types";
import { MultiChoiceQuestion_GetUserAnswersQuery } from "./__generated__/MultiChoiceQuestion_GetUserAnswersQuery.graphql";
import styles from "./styles/MultiChoiceQuestion.module.scss";

type Props = {
  id: string;
  question: Question;
  placeholder?: string;
  textColor?: string;
};

const getUserAnswersQuery = graphql`
  query MultiChoiceQuestion_GetUserAnswersQuery(
    $username: String!
    $questionIds: [String!]!
  ) {
    getUserAnswersQuery(username: $username, questionIds: $questionIds) {
      question_id
      answer
    }
  }
`;

const MultiChoiceQuestion: FC<Props> = ({ id, question }) => {
  if (!id) return;
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.session.user);
  const userAnswersData =
    useLazyLoadQuery<MultiChoiceQuestion_GetUserAnswersQuery>(
      getUserAnswersQuery,
      { username: user?.username || "", questionIds: [id] }
    );
  const questionText = question.question;
  const allowMultipleSelections = questionText.includes(
    "Select all that apply"
  );
  const selectedValues =
    useAppSelector((state) => state.session.answers[id]) ||
    (allowMultipleSelections ? [] : "");

  useEffect(() => {
    if (userAnswersData.getUserAnswersQuery) {
      dispatch(
        setAnswer({
          question_id: id,
          answer: allowMultipleSelections
            ? userAnswersData.getUserAnswersQuery[0]?.answer?.split(",")
            : userAnswersData.getUserAnswersQuery[0]?.answer,
        } as Answer)
      );
    }
  }, [userAnswersData.getUserAnswersQuery, dispatch]);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedOption = event.target.value;

    if (allowMultipleSelections) {
      const currentValues = Array.isArray(selectedValues)
        ? selectedValues
        : [selectedValues];
      if (event.target.checked) {
        const newSelectedValues = [...currentValues, selectedOption];
        dispatch(setAnswer({ question_id: id, answer: newSelectedValues }));
      } else {
        const newSelectedValues = currentValues.filter(
          (val) => val !== selectedOption
        );
        dispatch(setAnswer({ question_id: id, answer: newSelectedValues }));
      }
    } else {
      dispatch(setAnswer({ question_id: id, answer: selectedOption }));
    }
  };

  return (
    <div>
      <p>{questionText}</p>
      <div className={styles.optionsWrapper}>
        {question.options?.map((option, index) => (
          <div key={index} className={styles.option}>
            <label>
              <input
                type={allowMultipleSelections ? "checkbox" : "radio"}
                name={`question_${id}`}
                value={option}
                checked={
                  allowMultipleSelections
                    ? selectedValues.includes(option)
                    : selectedValues === option
                }
                onChange={handleOnChange}
              />
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiChoiceQuestion;
