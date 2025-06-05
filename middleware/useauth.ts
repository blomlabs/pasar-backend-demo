import { ZoltraHandler } from "zoltra";
import { User } from "../types/app";
import { fetchAuthUser } from "./shared";
import resMessages from "../constants/res-messages";
import { verifyToken } from "../utils/jwt";

export const useAuthToken: ZoltraHandler = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (token) {
      const decoded = verifyToken(token);

      const user = await fetchAuthUser(decoded.email);

      if (!user)
        return res.status(404).json({
          error: resMessages._404_ERR,
          success: false,
          message: "User not found",
        });

      req.user = user[0] as User;

      next();
      return;
    }

    await next();
  } catch (error) {
    throw error;
  }
};
