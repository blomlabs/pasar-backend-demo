import { ZoltraHandler } from "zoltra";
import { throwIfInvalid } from "../utils/global";
import resMessages from "../constants/res-messages";
import { removeDuplicatesByPath, slugify } from "../utils/functions";
import { Feedback, Product } from "../types/app";
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
    brand,
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
        "brand",
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
        brand,
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
    const product = await pgClient.findOne<Product>({
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

    if (req.user) {
      console.log("history:", {
        id: 1,
        user_id: req.user.id,
        product_id: product.data?.id,
      });
    }

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

export const editProduct: ZoltraHandler = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const keysToUpdate = Object.keys(req.body);
    const values = Object.values(req.body);

    throwIfInvalid(
      keysToUpdate.length === 0,
      "Please pick a valid field to update",
      "PRODUCT_UPDATE_ERR",
      400
    );

    throwIfInvalid(
      values.length === 0,
      "Please enter a valid input",
      "PRODUCT_UPDATE_ERR",
      400
    );

    const response = await pgClient.findByIdAndUpdate({
      table: "products",
      returning_fields: ["*"],
      fieldToUpdates: keysToUpdate,
      values: [productId, req.user.id, ...values],
      $and: "user_id = $2",
    });

    throwIfInvalid(
      !response.success,
      "You're not Authorized to edit this product",
      resMessages.AUTHORIZATION_ERR,
      401
    );

    res.status(200).json({
      success: true,
      message: "Product successfully edited",
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
};

export const getBrands: ZoltraHandler = async (req, res, next) => {
  try {
    const response = await pgClient.findMany<any[]>({
      table: "products",
      columns: ["brand"],
      $where: "brand notnull",
    });

    throwIfInvalid(
      !response.success,
      "No brand found",
      resMessages._404_ERR,
      404
    );

    const result = removeDuplicatesByPath(response.data!, "brand");

    res.status(200).json({
      success: true,
      message: resMessages._Data_Query,
      length: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductByBrand: ZoltraHandler = async (req, res, next) => {
  const { brand } = req.params;
  try {
    const response = await pgClient.findMany<Product[]>({
      table: "products",
      $where: "brand = $1",
      values: [brand],
    });

    throwIfInvalid(
      !response.success,
      `No product found for '${brand}'`,
      resMessages._404_ERR,
      404
    );

    res.status(200).json({
      success: true,
      message: resMessages._Data_Query,
      length: response.data?.length,
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
};

// Get all feedback
export const getFeedback: ZoltraHandler = async (req, res, next) => {
  try {
    const feedbacks = await pgClient.findMany<any[]>({ table: "feedback" });

    throwIfInvalid(
      !feedbacks.success,
      "No feedback found",
      resMessages._404_ERR,
      404
    );

    res.status(200).json({
      success: true,
      message: resMessages._Data_Query,
      length: feedbacks.data?.length,
      data: feedbacks.data,
    });
  } catch (error) {
    next(error);
  }
};

// Get all feedbacks for a products
export const getProductFeedBacks: ZoltraHandler = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const feedbacks = await pgClient.findMany<Feedback[]>({
      table: "feedback",
      $where: "product_id = $1",
      values: [productId],
    });

    throwIfInvalid(
      !feedbacks.success,
      "No feedback found for this product",
      resMessages._404_ERR,
      404
    );

    res.status(200).json({
      success: true,
      message: resMessages._Data_Query,
      length: feedbacks.data?.length,
      data: feedbacks.data,
    });
  } catch (error) {
    next(error);
  }
};

// Rate product
export const rateProduct: ZoltraHandler = async (req, res, next) => {
  const { productId, comment, rating } = req.body;
  try {
    const product = await pgClient.findById({
      table: "products",
      columns: ["id"],
      id_value: productId,
    });

    throwIfInvalid(
      !product.success,
      "Product not found",
      resMessages._404_ERR,
      404
    );

    const username = `${req.user.firstname} ${req.user.lastname}`;

    const feedback = await pgClient.insertOne({
      table: "feedback",
      columns: ["product_id", "comment", "rating", "user_id", "username"],
      values: [productId, comment, rating, req.user.id, username],
      returning: ["*"],
    });

    throwIfInvalid(
      !feedback.success,
      "Something went wrong",
      "INSERT_ERR",
      400
    );

    res.status(200).json({
      success: true,
      message: "Feedback successfully created",
      data: feedback.data,
    });
  } catch (error) {
    next(error);
  }
};
