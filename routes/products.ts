import { defineRoutes } from "zoltra";
import {
  createProduct,
  deleteProduct,
  fetchProductForSeller,
  getBrands,
  getProduct,
  getProductByBrand,
  getProducts,
  editProduct,
  getFeedback,
  getProductFeedBacks,
  rateProduct,
} from "../controllers/product";
import { authorizeUser } from "../middleware/authorize-user";
import validateFields from "../middleware/vaildateFields";
import { useAuthToken } from "../middleware/useauth";

export const routes = defineRoutes([
  {
    path: "/",
    method: "POST",
    handler: createProduct,
    middleware: [
      authorizeUser,
      validateFields([
        "name",
        "category_id",
        "sub_category_id",
        "price",
        "description",
        "images",
        "color",
        "brand",
      ]),
    ],
  },
  {
    path: "/feedbacks/comment",
    method: "POST",
    handler: rateProduct,
    middleware: [
      authorizeUser,
      validateFields(["productId", "comment", "rating"]),
    ],
  },
  {
    method: "GET",
    handler: getProducts,
    path: "/",
  },
  {
    method: "GET",
    path: "/:slug",
    handler: getProduct,
    middleware: [useAuthToken],
  },
  {
    method: "GET",
    path: "/seller/:seller",
    handler: fetchProductForSeller,
  },
  {
    method: "GET",
    path: "/brands/all",
    handler: getBrands,
  },
  {
    method: "GET",
    path: "/brands/single/:brand",
    handler: getProductByBrand,
  },
  {
    method: "GET",
    path: "/feedbacks/all",
    handler: getFeedback,
  },
  {
    method: "GET",
    path: "/feedbacks/product/:productId",
    handler: getProductFeedBacks,
  },
  {
    method: "PATCH",
    path: "/edit/:productId",
    handler: editProduct,
    middleware: [authorizeUser],
  },
  {
    method: "DELETE",
    path: "/delete/:productId",
    handler: deleteProduct,
    middleware: [authorizeUser],
  },
]);
