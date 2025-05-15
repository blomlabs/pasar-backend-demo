import { Pool, QueryResult, QueryResultRow } from "pg";
import { RequestError } from "zoltra";
import PostgresClient from "../instances/pg-utils";

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: 5432,
});

export const query = async (
  action: string,
  values?: unknown[]
): Promise<QueryResult<QueryResultRow> | undefined> => {
  const client = await pool.connect();
  try {
    return await client.query(action, values);
  } catch (error) {
    const er = error as Error;
    const err = new RequestError(er.message, "PgQueryError", 500);
    throw err;
  } finally {
    client.release();
  }
};

export const Query = async (action: string, values?: unknown[]) => {
  const data = await query(action, values);
  return data?.rows || [];
};

export const pgClient = new PostgresClient(query);
