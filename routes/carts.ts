import { defineRoutes } from "zoltra";
import {
  addToCart,
  checkout,
  clearCart,
  getCartItems,
  removeItemFromCart,
  updateCartQuantity,
} from "../controllers/cart";
import validateFields from "../middleware/vaildateFields";
import { authorizeUser } from "../middleware/authorize-user";

export const routes = defineRoutes([
  {
    path: "/",
    method: "GET",
    handler: getCartItems,
    middleware: [authorizeUser],
  },
  {
    path: "/add",
    method: "POST",
    handler: addToCart,
    middleware: [authorizeUser, validateFields(["productId", "quantity"])],
  },
  {
    path: "/checkout",
    method: "POST",
    handler: checkout,
    middleware: [authorizeUser, validateFields(["payment_method"])],
  },
  {
    path: "/update-quantity",
    method: "PATCH",
    handler: updateCartQuantity,
    middleware: [authorizeUser, validateFields(["cartItemId", "newQuantity"])],
  },
  {
    path: "/remove/:cartItemId",
    method: "PATCH",
    handler: removeItemFromCart,
    middleware: [authorizeUser],
  },
  {
    path: "/delete",
    method: "DELETE",
    handler: clearCart,
    middleware: [authorizeUser],
  },
]);
