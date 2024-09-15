"use client";
import { ChangeEvent, FC, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store";
import { graphql, useLazyLoadQuery } from "react-relay";
import { Answer, setAnswer } from "../slices/sessionSlice";
import { Question } from "../utils/types";
import { InputQuestion_GetUserAnswersQuery } from "./__generated__/InputQuestion_GetUserAnswersQuery.graphql";
import styles from "./styles/TextInput.module.scss";

type Props = {
  id: string;
  question: Question;
  placeholder?: string;
  textColor?: string;
};

const getUserAnswersQuery = graphql`
  query InputQuestion_GetUserAnswersQuery(
    $username: String!
    $questionIds: [String!]!
  ) {
    getUserAnswersQuery(username: $username, questionIds: $questionIds) {
      question_id
      answer
    }
  }
`;

const InputQuestion: FC<Props> = ({ id, question, placeholder, textColor }) => {
  if (!id) return;
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.session.user);
  const value = useAppSelector((state) => state.session.answers[id]);

  const userAnswersData = useLazyLoadQuery<InputQuestion_GetUserAnswersQuery>(
    getUserAnswersQuery,
    { username: user?.username || "", questionIds: [id] }
  );

  useEffect(() => {
    if (userAnswersData.getUserAnswersQuery) {
      dispatch(
        setAnswer({
          question_id: id,
          answer: userAnswersData.getUserAnswersQuery[0]?.answer,
        } as Answer)
      );
    }
  }, [userAnswersData.getUserAnswersQuery, dispatch]);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setAnswer({ question_id: id, answer: event.target.value }));
  };

  return (
    <div>
      <p>{question.question}</p>
      <div className={styles.inputWrapper}>
        <input
          onChange={handleOnChange}
          value={value || ""}
          style={{ color: textColor }}
          placeholder={placeholder}
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default InputQuestion;
