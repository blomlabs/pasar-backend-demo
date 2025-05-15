import { defineRoutes } from "zoltra";
import { registerUser, signIn } from "../controllers/auth";
import validateFields from "../middleware/vaildateFields";
import validateEmail from "../middleware/vaildateEmail";

export const routes = defineRoutes([
  {
    method: "POST",
    path: "/sign-up",
    handler: registerUser,
    middleware: [
      validateFields([
        "email",
        "firstName",
        "lastName",
        "password",
        "country",
        "state_of_origin",
        "gender",
        "phone_number",
        "account_type",
      ]),
      validateEmail,
    ],
  },
  {
    method: "POST",
    path: "/sign-in",
    handler: signIn,
    middleware: [validateFields(["email", "password"]), validateEmail],
  },
]);
