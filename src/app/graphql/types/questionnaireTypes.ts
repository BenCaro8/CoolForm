import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLBoolean
} from 'graphql';
import { GraphQLJSONObject } from 'graphql-type-json';


export const QuestionnaireType = new GraphQLObjectType({
    name: 'Questionnaire',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLString),
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
});

export const JunctionType = new GraphQLObjectType({
    name: 'Junction',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLString),
        },
        question_id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        questionnaire_id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        priority: {
            type: new GraphQLNonNull(GraphQLInt),
        },
    },
});

export const UserAnswerType = new GraphQLObjectType({
    name: 'UserAnswer',
    fields: {
        user_username: { type: new GraphQLNonNull(GraphQLString) },
        question_id: { type: new GraphQLNonNull(GraphQLString) },
        answer: { type: GraphQLString },
    },
});

export const QuestionType = new GraphQLObjectType({
    name: 'Question',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLString),
        },
        question: {
            type: new GraphQLNonNull(GraphQLJSONObject),
        },
    },
});

export const SubmitAnswerInputType = new GraphQLInputObjectType({
    name: 'SubmitAnswerInput',
    fields: {
        questionId: { type: new GraphQLNonNull(GraphQLString) },
        answer: { type: new GraphQLNonNull(GraphQLString) },
    },
});

export const SubmitAnswersInputType = new GraphQLInputObjectType({
    name: 'SubmitAnswersInput',
    fields: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        answers: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SubmitAnswerInputType))) },
    },
});

export const SubmitAnswersPayloadType = new GraphQLObjectType({
    name: 'SubmitAnswersPayload',
    fields: {
        success: { type: new GraphQLNonNull(GraphQLBoolean) },
        message: { type: GraphQLString },
    },
});
