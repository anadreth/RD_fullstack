import { Kysely } from 'kysely'
import { Database } from './types/database'
import { NeonHTTPDialect } from 'kysely-neon'

export const db = new Kysely<Database>({
  dialect: new NeonHTTPDialect({
    connectionString: process.env.DB_NEON_CONNECTION_STRING as string,
  }),
})