import { defineRoutes } from "zoltra";

export const routes = defineRoutes([
  {
    method: "GET",
    path: "/",
    handler: (req, res) => {
      res.status(200).json({
        users: [
          { id: 1, name: "Alice" },
          { id: 2, name: "Bob" },
        ],
      });
    },
  },
  //   {
  //     method: "POST",
  //     path: "/",
  //     handler: (req, res) => {
  //       res.status(201).json({ message: "User created", data: req.body });
  //     },
  //   },
]);
