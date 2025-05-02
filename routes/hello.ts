import { defineRoutes } from "zoltra";
import { helloController } from "../controllers/hello";

export const routes = defineRoutes([
  {
    method: "GET",
    path: "/",
    handler: helloController,
  },
]);
