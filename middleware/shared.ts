import { Query } from "../config/pg-client";

export const fetchAuthUser = async (email: string) => {
  try {
    const user = await Query(
      `SELECT email, id, account_type, is_admin, firstname, lastname from users
       WHERE email = $1`,
      [email]
    );
    return user;
  } catch (error) {
    throw error;
  }
};
