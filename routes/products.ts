import { defineRoutes } from "zoltra";
import {
  createProduct,
  deleteProduct,
  fetchProductForSeller,
  getProduct,
  getProducts,
} from "../controllers/product";
import { authorizeUser } from "../middleware/authorize-user";
import validateFields from "../middleware/vaildateFields";

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
        "brand_id",
      ]),
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
  },
  {
    method: "GET",
    path: "/seller/:seller",
    handler: fetchProductForSeller,
  },
  {
    method: "DELETE",
    path: "/delete/:productId",
    handler: deleteProduct,
    middleware: [authorizeUser],
  },
]);
