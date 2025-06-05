import { ZoltraHandler } from "zoltra";
import { pgClient } from "../config/pg-client";
import { CartProps, PaymentMethod, Product } from "../types/app";
import { throwIfInvalid } from "../utils/global";
import resMessages from "../constants/res-messages";
import { generateId, removeFromArr } from "../utils/functions";
import { PaymentMethods } from "../utils/enums";

export const addToCart: ZoltraHandler = async (req, res, next) => {
  const { quantity, productId } = req.body;
  try {
    const product = await pgClient.findById({
      table: "products",
      id_value: productId,
    });

    throwIfInvalid(
      !product.success,
      "Product not found",
      resMessages._404_ERR,
      404
    );

    const item = {
      id: generateId(16),
      quantity,
      product: product.data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Check if the user already has an exiting cart
    const exitingCart = await pgClient.findById<CartProps>({
      table: "carts",
      columns: ["user_id", "cart_items"],
      id_value: req.user.id,
      objectId: "user_id",
    });

    // If he/she has add the new item to cart_items
    if (exitingCart.success && exitingCart.data) {
      const cartItems = exitingCart.data?.cart_items;

      const updatedCart = [...cartItems, item];

      const jsonbArray = updatedCart.map((obj) => JSON.stringify(obj));

      const response = await pgClient.updateById({
        table: "carts",
        fieldToUpdates: ["cart_items"],
        values: [req.user.id, jsonbArray],
        objectId: "user_id",
        returning_fields: ["*"],
      });

      throwIfInvalid(
        !response.success,
        "Something went wrong",
        "UPDATE_ERR",
        400
      );

      return res.status(201).json({
        success: true,
        message: "Product successfully added to cart",
        data: response.data,
      });
    }

    // Else create new one
    const addCart = await pgClient.insertOne<CartProps>({
      table: "carts",
      columns: ["user_id", "cart_items"],
      jsonbArr: [2],
      values: [req.user.id, [JSON.stringify(item)]],
      returning: ["*"],
    });

    throwIfInvalid(!addCart.success, "Something went wrong", "INSERT_ERR", 400);

    res.status(201).json({
      success: true,
      message: "Product successfully added to cart",
      data: addCart.data,
    });
  } catch (error) {
    next(error);
  }
};

export const getCartItems: ZoltraHandler = async (req, res, next) => {
  try {
    const response = await pgClient.findOne<CartProps>({
      table: "carts",
      $where: "user_id = $1",
      values: [req.user.id],
    });

    throwIfInvalid(
      !response.success,
      "No active cart found",
      resMessages._404_ERR,
      404
    );

    res.status(200).json({
      success: true,
      message: resMessages._Data_Query,
      length: response.data?.cart_items.length,
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartQuantity: ZoltraHandler = async (req, res, next) => {
  const { cartItemId, newQuantity } = req.body;
  try {
    const cart = await pgClient.findOne<CartProps>({
      table: "carts",
      $where: "user_id = $1",
      values: [req.user.id],
    });

    throwIfInvalid(
      !cart.success,
      "No active cart found",
      resMessages._404_ERR,
      404
    );

    const cartItems = cart.data?.cart_items;

    let hasUpdate = false;

    const updateItems = cartItems?.map((item) => {
      if (item.id === cartItemId) {
        hasUpdate = true;
        return { ...item, quantity: newQuantity };
      }

      return item;
    });

    const response = await pgClient.updateById<CartProps>({
      table: "carts",
      objectId: "user_id",
      values: [req.user.id, updateItems],
      fieldToUpdates: ["cart_items"],
      jsonbArr: [1],
      returning_fields: ["*"],
    });

    throwIfInvalid(
      !response.success,
      "Failed to update cart",
      "400_BAD_REQ",
      400
    );

    res.status(200).json(
      hasUpdate
        ? {
            success: true,
            message: "Quantity successfully update",
            data: newQuantity,
            cart_items: updateItems,
          }
        : { success: false, message: "No item to update" }
    );
  } catch (error) {
    next(error);
  }
};

export const removeItemFromCart: ZoltraHandler = async (req, res, next) => {
  const { cartItemId } = req.params;
  try {
    const cart = await pgClient.findOne<CartProps>({
      table: "carts",
      $where: "user_id = $1",
      values: [req.user.id],
    });

    throwIfInvalid(
      !cart.success,
      "No active cart found",
      resMessages._404_ERR,
      404
    );

    const jsonbResult = removeFromArr(cart.data?.cart_items!, "id", cartItemId);

    throwIfInvalid(
      !jsonbResult.hasUpdate,
      "CartItem not found",
      resMessages._404_ERR,
      404
    );

    const response = await pgClient.updateById({
      table: "carts",
      objectId: "user_id",
      fieldToUpdates: ["cart_items"],
      jsonbArr: [1],
      values: [req.user.id, jsonbResult.res],
      returning_fields: ["*"],
    });

    throwIfInvalid(
      !response.success,
      "Something went wrong",
      "UPDATE_ERR",
      400
    );

    res.status(200).json({
      success: true,
      message: "Item successfully removed from cart",
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart: ZoltraHandler = async (req, res, next) => {
  try {
    const response = await pgClient.deleteOne({
      table: "carts",
      $where: "user_id = $1",
      values: [req.user.id],
      shouldReturnData: true,
    });

    throwIfInvalid(
      !response.success,
      "No active cart found",
      resMessages._404_ERR,
      404
    );

    res.status(200).json({
      success: true,
      message: "Cart successfully deleted",
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
};

export const checkout: ZoltraHandler = async (req, res, next) => {
  const { payment_method } = req.body;

  try {
    const carts = await pgClient.findOne<CartProps>({
      table: "carts",
      $where: "user_id = $1",
      values: [req.user.id],
    });

    throwIfInvalid(
      !carts.success,
      "No active cart found",
      resMessages._404_ERR,
      404
    );

    const items = carts.data?.cart_items;

    throwIfInvalid(
      !PaymentMethods[payment_method as PaymentMethod],
      `Invalid payment method '${payment_method}' use 'fiat' or 'crypto'`,
      "INVALID_PAYMENT_METHOD",
      400
    );

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "You don't have any item",
        error: "EMPTY_CART",
      });
    }

    let totalPrice = 0;
    let totalFees = 0;

    await Promise.all(
      items.map(async (item) => {
        const product = await pgClient.findById<Product>({
          table: "products",
          id_value: item.product.id,
        });

        throwIfInvalid(
          !product.success,
          `Product '${item.product.name}' does not exist`,
          resMessages._404_ERR,
          404
        );

        throwIfInvalid(
          Boolean(product.data && product.data.quantity < item.quantity),
          `Product '${item.product.name}' is out of stock`,
          "OUT_OF_STOCK",
          400,
          res
        );

        // Accumulate totals
        totalPrice += product.data!.price * item.quantity;
        totalFees += product.data!.shipping_fee * item.quantity;
      })
    );

    const order_number = generateId(10);

    return res.status(200).json({
      success: true,
      message: "Order successfully created",
      data: {
        totalPrice,
        totalFees,
        quantity: items.length,
        order_number,
      },
    });
  } catch (error) {
    next(error);
  }
};
