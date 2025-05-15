import { ZoltraHandler } from "zoltra";
import { throwIfInvalid } from "../utils/global";
import resMessages from "../constants/res-messages";
import { slugify } from "../utils/functions";
import { Product } from "../types/app";
import { pgClient } from "../config/pg-client";

export const createProduct: ZoltraHandler = async (req, res, next) => {
  const {
    name,
    category_id,
    price,
    description,
    images,
    sub_category_id,
    color,
    brand_id,
  } = req.body;
  try {
    throwIfInvalid(
      req.user.account_type !== "seller",
      "You must be a seller before you can sell on 'Pasar'",
      resMessages._SELLER_ONLY_ACTION,
      403
    );

    const slug = slugify(name);

    const seller = slugify(`${req.user.firstname} ${req.user.lastname}`);

    const newProduct = await pgClient.insertOne({
      table: "products",
      columns: [
        "name",
        "category_id",
        "price",
        "description",
        "images",
        "slug",
        "user_id",
        "sub_category_id",
        "color",
        "brand_id",
        "seller",
      ],
      values: [
        name,
        category_id,
        price,
        description,
        images,
        slug,
        req.user.id,
        sub_category_id,
        color,
        brand_id,
        seller,
      ],
      returning: ["*"],
    });

    throwIfInvalid(
      !newProduct.success,
      "Something went wrong",
      "INSERT_ERR",
      400
    );

    res.status(201).json({
      success: true,
      message: "Product successfully created",
      data: newProduct.data,
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts: ZoltraHandler = async (req, res, next) => {
  const { page, limit, order, sortBy } = req.query;
  try {
    const products = await pgClient.findMany<Product[]>({
      table: "products",
      $limit: {
        page,
        limit,
        order,
        sortBy,
      },
    });

    throwIfInvalid(
      !products.success,
      "No products found",
      resMessages._404_ERR,
      404
    );

    res.status(200).json({
      success: true,
      message: resMessages._Data_Query,
      length: products.data?.length,
      page: page,
      limit: limit,
      data: products.data,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct: ZoltraHandler = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const product = await pgClient.findOne({
      table: "products",
      $where: "slug = $1",
      values: [slug],
    });

    throwIfInvalid(
      !product.success,
      "Product not found",
      resMessages._404_ERR,
      404
    );

    res.status(200).json({
      success: true,
      message: resMessages._Data_Query,
      data: product.data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct: ZoltraHandler = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const deletedProduct = await pgClient.findByIdAndDelete({
      table: "products",
      $and: "user_id = $2",
      values: [productId, req.user.id],
      shouldReturnData: true,
    });

    throwIfInvalid(
      !deletedProduct.success,
      "You're not Authorized to delete this product",
      resMessages.AUTHORIZATION_ERR,
      401
    );

    res.status(200).json({
      success: true,
      message: "Product successfully deleted",
      data: deletedProduct.data,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchProductForSeller: ZoltraHandler = async (req, res, next) => {
  const { seller } = req.params;
  try {
    const products = await pgClient.findMany<Product[]>({
      table: "products",
      $where: "seller = $1",
      values: [seller],
    });

    throwIfInvalid(
      !products.success,
      "No products found for this seller",
      resMessages._404_ERR,
      404
    );

    res.status(200).json({
      message: resMessages._Data_Query,
      success: true,
      length: products.data?.length,
      data: products.data,
    });
  } catch (error) {
    next(error);
  }
};
