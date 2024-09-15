import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
} from 'graphql';

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: new GraphQLNonNull(GraphQLString) },
    },
});