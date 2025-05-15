import { RequestError, ZoltraHandler } from "zoltra";
import { comparePassword, hashPassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { User } from "../types/app";
import { newUserColumns, userColumns } from "../constants/columns";
import resMessages from "../constants/res-messages";
import { pgClient } from "../config/pg-client";

export const registerUser: ZoltraHandler = async (req, res, next) => {
  const {
    email,
    firstName,
    lastName,
    password,
    country,
    state_of_origin,
    gender,
    website,
    phone_number,
    account_type,
  } = req.body;
  try {
    const userExits = await pgClient.findOne({
      table: "users",
      $where: "email = $1",
      $or: "phone_number = $2",
      values: [email, phone_number],
    });

    if (userExits?.success) {
      const error = new RequestError(
        "User Already exits",
        resMessages._AUTH_ERR,
        403
      );
      throw error;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await pgClient.insertOne<User>({
      table: "users",
      columns: newUserColumns,
      returning: userColumns,
      values: [
        email,
        firstName,
        lastName,
        hashedPassword,
        country,
        state_of_origin,
        gender,
        phone_number,
        website,
        account_type,
      ],
    });

    if (!newUser.success) {
      const error = new RequestError(
        "Something went wrong",
        resMessages._AUTH_ERR,
        401
      );
      throw error;
    }

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: { user: newUser.data, token: signToken(newUser.data!) },
    });
  } catch (error) {
    next(error);
  }
};

export const signIn: ZoltraHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await pgClient.findOne<User>({
      table: "users",
      $where: "email = $1",
      values: [email],
      columns: [...userColumns, "password"],
    });

    if (!user.success) {
      const error = new RequestError(
        "User not found",
        resMessages._AUTH_ERR,
        404
      );
      throw error;
    }

    const isMatched = await comparePassword(
      password,
      String(user?.data?.password)
    );

    if (!isMatched) {
      const error = new RequestError(
        "Invalid password",
        "InvalidCredentails",
        404
      );
      throw error;
    }

    delete user?.data?.password;

    const token = signToken(user.data as User);
    res
      .status(200)
      .json({ success: true, message: "Sign In Successful", data: token });
  } catch (error) {
    next(error);
  }
};
