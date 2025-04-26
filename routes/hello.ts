import { defineRoutes } from "zoltra";
import { helloController } from "../controllers/hello";

const userRoutes = defineRoutes([
  {
    method: "GET",
    path: "/api/hello",
    handler: helloController,
  },
]);

export const routes = userRoutes;
