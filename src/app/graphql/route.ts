import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import schema from './schema';

const server = new ApolloServer({
    schema,
});

const handler = startServerAndCreateNextHandler(server);

export async function POST(request: Request) {
    return handler(request);
}