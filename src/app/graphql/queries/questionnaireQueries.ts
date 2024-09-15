import {
    GraphQLNonNull,
    GraphQLFieldConfig,
    GraphQLList,
    GraphQLString
} from 'graphql';
import { QuestionnaireType, JunctionType, QuestionType, UserAnswerType } from '../types/questionnaireTypes';
import { pool } from './../schema';

export const getJunctionByIDQuery: GraphQLFieldConfig<any, any> = {
    type: JunctionType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, { id }) => {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM junction WHERE id = $1', [id]);
            return result.rows[0];
        } finally {
            client.release();
        }
    },
};

export const getQuestionnaireByIDQuery: GraphQLFieldConfig<any, any> = {
    type: QuestionnaireType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, { id }) => {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM questionnaires WHERE id = $1', [id]);
            return result.rows[0];
        } finally {
            client.release();
        }
    },
};

export const getAllQuestionnairesQuery: GraphQLFieldConfig<any, any> = {
    type: new GraphQLList(QuestionnaireType),
    resolve: async () => {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM questionnaires');
            return result.rows;
        } finally {
            client.release();
        }
    },
};

export const getQuestionByIDQuery: GraphQLFieldConfig<any, any> = {
    type: QuestionType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, { id }) => {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM questions WHERE id = $1', [id]);
            return result.rows[0];
        } finally {
            client.release();
        }
    },
};

export const getJunctionsByQuestionnaireIDQuery: GraphQLFieldConfig<any, any> = {
    type: new GraphQLList(JunctionType),
    args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, { id }) => {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM junction WHERE questionnaire_id = $1', [id]);
            return result.rows;
        } finally {
            client.release();
        }
    },
};

export const getAllJunctions: GraphQLFieldConfig<any, any> = {
    type: new GraphQLList(JunctionType),
    resolve: async () => {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM junction;');
            return result.rows;
        } finally {
            client.release();
        }
    },
};

export const getQuestionsByIDsQuery: GraphQLFieldConfig<any, any> = {
    type: new GraphQLList(QuestionType),
    args: {
        ids: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
    },
    resolve: async (_, { ids }) => {
        const client = await pool.connect();
        try {
            const query = 'SELECT * FROM questions WHERE id = ANY($1::int[])';
            const result = await client.query(query, [ids]);
            return result.rows;
        } finally {
            client.release();
        }
    },
};

export const getAllQuestions: GraphQLFieldConfig<any, any> = {
    type: new GraphQLList(QuestionType),
    resolve: async () => {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM questions;');
            return result.rows;
        } finally {
            client.release();
        }
    },
};

export const getUserAnswersQuery = {
    type: new GraphQLList(UserAnswerType),
    args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        questionIds: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))) },
    },
    resolve: async (_: any, { username, questionIds }: any) => {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT question_id, answer FROM user_answers WHERE user_username = $1 AND question_id = ANY($2)`,
                [username, questionIds]
            );
            return result.rows;
        } finally {
            client.release();
        }
    },
};

const queries = {
    getJunctionByIDQuery,
    getQuestionnaireByIDQuery,
    getAllQuestionnairesQuery,
    getQuestionByIDQuery,
    getJunctionsByQuestionnaireIDQuery,
    getAllJunctions,
    getAllQuestions,
    getQuestionsByIDsQuery,
    getUserAnswersQuery
};

export default queries;