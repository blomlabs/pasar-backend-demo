import { RequestError, ZoltraHandler } from "zoltra";
import { Query } from "../config/pg-client";
import { comparePassword, hashPassword } from "../utils/password";
import { signToken } from "../utils/jwt";

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
  } = req.body;
  try {
    const userExits = await Query(
      "SELECT * FROM users WHERE email = $1 OR phone_number = $2",
      [email, phone_number]
    );

    if (userExits?.length === 1) {
      const error = new RequestError(
        "User Already exits",
        "AuthenticationErr",
        403
      );
      throw error;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await Query(
      `INSERT INTO users(email, firstName, lastName, password, country, state_of_origin, gender, phone_number, website)
         VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        `,
      [
        email,
        firstName,
        lastName,
        hashedPassword,
        country,
        state_of_origin,
        gender,
        phone_number,
        website,
      ]
    );

    if (!newUser) {
      return;
    }

    res.status(201).json({
      message: "Registration successful",
      data: { token: signToken(newUser[0]), user: newUser[0] },
    });
  } catch (error) {
    next(error);
  }
};

export const signIn: ZoltraHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await Query(
      "SELECT id, email, password, firstName, lastName, country, state_of_origin, gender, phone_number, website FROM users WHERE email = $1",
      [email]
    );

    if (user?.length === 0) {
      const error = new RequestError("Users not found", "UserFetchErr", 404);
      throw error;
    }

    const isMatched = await comparePassword(password, user![0].password);
    if (!isMatched) {
      const error = new RequestError(
        "Invalid password",
        "InvalidCredentails",
        404
      );
      throw error;
    }

    delete user[0].password;

    const token = signToken(user[0]);
    res.status(200).json({ message: "Sign In Successful", data: token });
  } catch (error) {
    next(error);
  }
};
