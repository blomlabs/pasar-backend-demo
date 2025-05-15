import { RequestError, ZoltraHandler } from "zoltra";
import { User } from "../types/app";
import { userColumns } from "../constants/columns";
import resMessages from "../constants/res-messages";
import { pgClient } from "../config/pg-client";

export const getUsers: ZoltraHandler = async (req, res, next) => {
  const { page, limit, order, sortBy } = req.query;
  try {
    const users = await pgClient.findMany<User[]>({
      table: "users",
      columns: userColumns,
      $limit: {
        page,
        limit,
        order,
        sortBy,
      },
    });

    if (!users.success) {
      const error = new RequestError(
        "Users not found",
        resMessages._404_ERR,
        404
      );
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Users fetched",
      length: users.data?.length,
      page: page,
      limit: limit,
      data: users.data,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser: ZoltraHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await pgClient.findOne<User>({
      table: "users",
      $where: "id = $1",
      values: [id],
      columns: userColumns,
    });

    if (!data.success) {
      const error = new RequestError(
        "User not found",
        resMessages._404_ERR,
        404
      );
      throw error;
    }

    res
      .status(200)
      .json({ success: true, message: "User found", data: data.data });
  } catch (error) {
    next(error);
  }
};

export const getSellers: ZoltraHandler = async (req, res, next) => {
  const { page, limit, order, sortBy } = req.query;
  try {
    const data = await pgClient.findMany<User[]>({
      table: "users",
      $where: "account_type = $1",
      values: ["seller"],
      columns: userColumns,
      $limit: {
        page,
        limit,
        order,
        sortBy,
      },
    });

    if (!data.success) {
      const error = new RequestError(
        "Sellers not found",
        resMessages._404_ERR,
        404
      );
      throw error;
    }

    return res.status(200).json({
      message: "Data successfully retrived",
      success: true,
      length: data.data?.length,
      page: page,
      limit: limit,
      data: data.data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSeller: ZoltraHandler = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await pgClient.findOne<User>({
      table: "users",
      $where: "id = $1",
      $and: "account_type = $2",
      values: [userId, "seller"],
      columns: userColumns,
    });

    if (!user.success) {
      const error = new RequestError(
        "Seller not found",
        resMessages._404_ERR,
        404
      );
      throw error;
    }

    return res.status(200).json({
      message: "Data successfully retrived",
      success: true,
      data: user.data,
    });
  } catch (error) {
    next(error);
  }
};
