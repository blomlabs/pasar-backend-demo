import { RequestError, ZoltraHandler } from "zoltra";
import { Query } from "../config/pg-client";

export const getUsers: ZoltraHandler = async (req, res, next) => {
  try {
    const users = await Query(
      "SELECT id, email, firstName, lastName, country, state_of_origin, gender, phone_number, website FROM users"
    );

    if (users?.length === 0) {
      const error = new RequestError("Users not found", "UserFetchErr", 404);
      throw error;
    }

    res
      .status(200)
      .json({ message: "Users fetched", length: users?.length, data: users });
  } catch (error) {
    next(error);
  }
};

export const getUser: ZoltraHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await Query(
      "SELECT id, email, firstName, lastName, country, state_of_origin, gender, phone_number, website FROM users WHERE id = $1",
      [id]
    );

    if (user?.length === 0) {
      const error = new RequestError("User not found", "UserFetchErr", 404);
      throw error;
    }

    res.status(200).json({ message: "User found", data: user![0] });
  } catch (error) {
    next(error);
  }
};
