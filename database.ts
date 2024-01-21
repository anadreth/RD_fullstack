import { Kysely } from 'kysely'
import { Database } from './src/types/database'
import { NeonHTTPDialect } from 'kysely-neon'
import dotenv from 'dotenv'
dotenv.config()

export const db = new Kysely<Database>({
  dialect: new NeonHTTPDialect({
    connectionString: process.env.DB_NEON_CONNECTION_STRING as string,
  }),
})