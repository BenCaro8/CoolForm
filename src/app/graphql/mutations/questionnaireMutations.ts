import {
    GraphQLNonNull,
    GraphQLFieldConfig,
} from 'graphql';
import { SubmitAnswersInputType, SubmitAnswersPayloadType } from '../types/questionnaireTypes';
import { pool } from './../schema';

export const submitAnswersMutation: GraphQLFieldConfig<any, any> = {
    type: SubmitAnswersPayloadType,
    args: {
        input: { type: new GraphQLNonNull(SubmitAnswersInputType) },
    },
    resolve: async (_, { input }) => {
        const { username, answers } = input;

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            for (const answer of answers) {
                const { questionId, answer: answerText } = answer;

                await client.query(
                    `INSERT INTO user_answers (user_username, question_id, answer)
                     VALUES ($1, $2, $3)
                     ON CONFLICT (user_username, question_id)
                     DO UPDATE SET answer = EXCLUDED.answer`,
                    [username, questionId, answerText]
                );
            }

            await client.query('COMMIT');

            return {
                success: true,
                message: 'Answers submitted successfully',
            };
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error submitting answers:', error);
            return {
                success: false,
                message: 'Error submitting answers',
            };
        } finally {
            client.release();
        }
    },
};

const mutations = {
    submitAnswers: submitAnswersMutation,
};

export default mutations;