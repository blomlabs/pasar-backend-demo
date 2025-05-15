import { defineRoutes } from "zoltra";
import { getSeller, getSellers, getUser, getUsers } from "../controllers/user";

export const routes = defineRoutes([
  { method: "GET", path: "/", handler: getUsers },
  { method: "GET", path: "/:id", handler: getUser },
  { method: "GET", path: "/sellers/all", handler: getSellers },
  { method: "GET", path: "/sellers/one/:userId", handler: getSeller },
]);
