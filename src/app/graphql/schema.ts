import {
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql';
import questionnaireQueries from './queries/questionnaireQueries';
import userMutations from './mutations/userMutations';
import questionnaireMutations from './mutations/questionnaireMutations';
import userQueries from './queries/userQueries';
import pkg from 'pg';
import 'dotenv/config';
import { configDotenv } from 'dotenv';

configDotenv();

const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,  // May need depending on SSL setup
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      ...questionnaireQueries,
      ...userQueries,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
      ...userMutations,
      ...questionnaireMutations
    }
  }),
});

export default schema;