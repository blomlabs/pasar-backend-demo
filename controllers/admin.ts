import { RequestError, ZoltraHandler } from "zoltra";
import { User } from "../types/app";
import resMessages from "../constants/res-messages";
import { userColumns } from "../constants/columns";
import { pgClient } from "../config/pg-client";

export const grantPermission: ZoltraHandler = async (req, res, next) => {
  const { userId } = req.body;
  const { remove } = req.query;

  try {
    const val = remove === "true" ? false : true;

    const data = await pgClient.findByIdAndUpdate<User>({
      table: "users",
      values: [userId, val],
      fieldToUpdate: "is_admin",
      columns: ["is_admin", "id"],
    });

    if (data && data.success) {
      return res.status(200).json({
        message: val
          ? "Access successfully granted"
          : "Access successfully revoked",
        success: true,
        user: data.data,
      });
    }

    res.status(404).json({
      message: "User not found",
      success: false,
    });
  } catch (error) {
    next(error);
  }
};

export const grantSellerPrivilege: ZoltraHandler = async (req, res, next) => {
  const { userId } = req.body;
  // const { remove } = req.query;
  try {
    const data = await pgClient.findByIdAndUpdate<User>({
      table: "users",
      fieldToUpdate: "account_type",
      values: [userId, "seller"],
      columns: ["id", "account_type"],
      returning_fields: ["account_type"],
    });

    if (data && data.success) {
      return res.status(200).json({
        message: "Seller privilege granted successfully",
        success: true,
      });
    }

    res.status(404).json({
      message: "User not found",
      success: false,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdmins: ZoltraHandler = async (req, res, next) => {
  try {
    const admins = await pgClient.findMany<User[]>({
      table: "users",
      $where: "is_admin = $1",
      values: [true],
      columns: [...userColumns, "is_admin"],
    });

    if (!admins.success) {
      const error = new RequestError(
        "No Admins found",
        resMessages._404_ERR,
        404
      );
      throw error;
    }

    res.status(200).json({
      success: true,
      message: resMessages._Data_Query,
      length: admins.data?.length,
      data: admins.data,
    });
  } catch (error) {
    next(error);
  }
};
