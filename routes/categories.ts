import { defineRoutes } from "zoltra";
import {
  createCategory,
  createSubCategory,
  getCategories,
  getSubCategories,
} from "../controllers/category";
import { authorizeAdmin } from "../middleware/authorize-admin";
import validateFields from "../middleware/vaildateFields";

export const routes = defineRoutes([
  {
    method: "POST",
    path: "/new",
    handler: createCategory,
    middleware: [authorizeAdmin, validateFields(["category_name"])],
  },
  {
    method: "POST",
    path: "/new/sub",
    handler: createSubCategory,
    middleware: [
      authorizeAdmin,
      validateFields(["category_name", "category_id"]),
    ],
  },
  {
    method: "GET",
    path: "/",
    handler: getCategories,
  },
  {
    method: "GET",
    path: "/subs",
    handler: getSubCategories,
  },
]);
