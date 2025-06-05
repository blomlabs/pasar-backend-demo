import { ZoltraHandler } from "zoltra";
import jwt from "jsonwebtoken";
import { JWT_AUTH_SECRET } from "../config/env";
import { User } from "../types/app";
import { fetchAuthUser } from "./shared";
import resMessages from "../constants/res-messages";

export const authorizeUser: ZoltraHandler = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token || typeof token === "undefined") {
      return res.status(403).json({
        error: "Unauthorized",
        success: false,
        message: "Authorization Token not found",
      });
    }

    const decoded = jwt.verify(token.trim(), String(JWT_AUTH_SECRET)) as User;

    const user = await fetchAuthUser(decoded.email);

    if (!user)
      return res.status(404).json({
        error: resMessages._404_ERR,
        success: false,
        message: "User not found",
      });

    req.user = user[0] as User;

    await next();
  } catch (error) {
    throw error;
  }
};
