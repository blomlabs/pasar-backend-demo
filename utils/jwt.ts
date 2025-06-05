import jwt from "jsonwebtoken";
import { JWT_AUTH_SECRET } from "../config/env";
import { AuthExpiryKey, User } from "../types/app";

export const signToken = <T extends object>(
  data: T,
  expiresIn: AuthExpiryKey = "7d"
) => {
  const SECRET = JWT_AUTH_SECRET;
  return jwt.sign(data, String(SECRET), { expiresIn });
};

export const verifyToken = (token: string) => {
  let user;

  try {
    user = jwt.verify(token, String(JWT_AUTH_SECRET)) as User;
    return user;
  } catch (error) {
    throw error;
  }
};
