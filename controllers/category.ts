import { ZoltraHandler } from "zoltra";
import { slugify } from "../utils/functions";
import resMessages from "../constants/res-messages";
import { throwIfInvalid } from "../utils/global";
import { pgClient } from "../config/pg-client";

export const createCategory: ZoltraHandler = async (req, res, next) => {
  const { category_name } = req.body;
  try {
    const category_slug = slugify(category_name);

    const data = await pgClient.insertOne<any[]>({
      table: "categories",
      columns: ["category_name", "category_slug"],
      values: [category_name, category_slug],
      returning: ["category_name", "category_slug", "created_at", "id"],
    });

    throwIfInvalid(!data.success, "Something went wrong", "INSERT_ERR", 400);

    res.status(201).json({
      success: true,
      message: "Category successfully created",
      length: data.data?.length,
      data: data.data,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories: ZoltraHandler = async (req, res, next) => {
  try {
    const categories = await pgClient.findMany({ table: "categories" });

    throwIfInvalid(
      !categories.success,
      "No category found",
      resMessages._404_ERR,
      404
    );

    res.status(200).json({
      success: true,
      message: resMessages._Data_Query,
      data: categories.data,
    });
  } catch (error) {
    next(error);
  }
};

export const createSubCategory: ZoltraHandler = async (req, res, next) => {
  const { category_name, category_id } = req.body;
  try {
    const category_slug = slugify(category_name);

    const data = await pgClient.insertOne<any[]>({
      table: "sub_categories",
      columns: ["category_name", "category_slug", "category_id"],
      values: [category_name, category_slug, category_id],
      returning: [
        "category_name",
        "category_slug",
        "created_at",
        "id",
        "category_id",
      ],
    });

    throwIfInvalid(!data.success, "Something went wrong", "INSERT_ERR", 400);

    res.status(201).json({
      success: true,
      message: "Category successfully created",
      length: data.data?.length,
      data: data.data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubCategories: ZoltraHandler = async (req, res, next) => {
  try {
    const categories = await pgClient.findMany({ table: "sub_categories" });

    throwIfInvalid(
      !categories.success,
      "No sub_category found",
      resMessages._404_ERR,
      404
    );

    res
      .status(200)
      .json({
        success: true,
        message: resMessages._Data_Query,
        data: categories.data,
      });
  } catch (error) {
    next(error);
  }
};
