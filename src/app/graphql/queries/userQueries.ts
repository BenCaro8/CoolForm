import {
    GraphQLFieldConfig,
    GraphQLList,
} from 'graphql';
import { pool } from './../schema';
import { UserType } from '../types/UserType';

export const getAllUsers: GraphQLFieldConfig<any, any> = {
    type: new GraphQLList(UserType),
    resolve: async () => {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM users WHERE role = \'user\';');
            return result.rows;
        } finally {
            client.release();
        }
    },
};

const queries = {
    getAllUsers,
};

export default queries;