import {
    GraphQLNonNull,
    GraphQLString,
    GraphQLFieldConfig,
} from 'graphql';
import { UserType } from '../types/UserType';
import bcrypt from 'bcrypt';
import { pool } from './../schema';

export const createUserMutation: GraphQLFieldConfig<any, any> = {
    type: UserType,
    args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, { username, password }) => {
        const client = await pool.connect();
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await client.query(
                'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
                [username, hashedPassword]
            );
            return result.rows[0];
        } finally {
            client.release();
        }
    },
};


export const loginUserMutation: GraphQLFieldConfig<any, any> = {
    type: UserType,
    args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, { username, password }) => {
        const client = await pool.connect();
        try {
            const result = await client.query(
                'SELECT * FROM users WHERE username = $1',
                [username]
            );
            const user = result.rows[0];

            if (!user) {
                throw new Error('User not found');
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new Error('Incorrect password');
            }

            return user;
        } finally {
            client.release();
        }
    },
};

const mutations = {
    createUser: createUserMutation,
    loginUser: loginUserMutation
};

export default mutations;