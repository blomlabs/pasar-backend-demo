import { defineRoutes } from "zoltra";
import { getUser, getUsers } from "../controllers/user";

export const routes = defineRoutes([
  { method: "GET", path: "/", handler: getUsers },
  { method: "GET", path: "/:id", handler: getUser },
]);
