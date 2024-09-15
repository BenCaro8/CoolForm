import { printSchema } from 'graphql';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import schema from './schema';

const schemaSDL = printSchema(schema);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, '../../../schema.graphql');

fs.writeFileSync(outputPath, schemaSDL);

console.log('GraphQL schema has been written to schema.graphql');