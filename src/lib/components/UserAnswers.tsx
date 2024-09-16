import { FC } from "react";
import { graphql, PreloadedQuery, usePreloadedQuery } from "react-relay";
import { UserAnswers_GetUserAnswersQuery } from "./__generated__/UserAnswers_GetUserAnswersQuery.graphql";
import styles from "./styles/UserAnswers.module.scss";
import classNames from "classnames";

const getUserAnswersQuery = graphql`
  query UserAnswers_GetUserAnswersQuery($username: String!) {
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

type Props = {
  queryReference: PreloadedQuery<UserAnswers_GetUserAnswersQuery>;
};

const UserAnswers: FC<Props> = ({ queryReference }) => {
  const data = usePreloadedQuery(getUserAnswersQuery, queryReference);

  if (
    !data.getAllUserAnswersQuery ||
    data.getAllUserAnswersQuery.length === 0
  ) {
    return (
      <div className={classNames(styles.wrapper, styles.textBlack)}>
        No answers found for this user.
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <ul>
        {data.getAllUserAnswersQuery.map((answer, index) => (
          <li key={index} className={styles.textBlack}>
            <strong>Question ID:</strong> {answer?.question_id} <br />
            <strong>Answer:</strong> {answer?.answer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserAnswers;
