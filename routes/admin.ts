import { defineRoutes } from "zoltra";
import {
  getAdmins,
  grantPermission,
  grantSellerPrivilege,
} from "../controllers/admin";
import { authorizeAdmin } from "../middleware/authorize-admin";
import validateFields from "../middleware/vaildateFields";

export const routes = defineRoutes([
  {
    method: "POST",
    path: "/grant-access",
    handler: grantPermission,
    middleware: [authorizeAdmin, validateFields(["userId"])],
  },
  {
    method: "POST",
    path: "/grant-seller-privilege",
    handler: grantSellerPrivilege,
    middleware: [authorizeAdmin, validateFields(["userId"])],
  },
  {
    method: "GET",
    path: "/all",
    handler: getAdmins,
    middleware: [authorizeAdmin],
  },
]);
