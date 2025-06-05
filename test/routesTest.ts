import { describeTest, extractJsonFromHttpResponse } from "zoltra";

export const test_Home_Route_Get = describeTest(async (t) => {
  await t.inject("GET", "/", (req, res, next) => {
    // res.status(200).json({ message: "Welcome to the API" });
    res.status(200).json("Welcome to the API");
    next();
  });
  const response = await t.request("GET", "/");
  t.assertResponse(response, 200);
  const res = extractJsonFromHttpResponse(response);
  t.assertContains(res, "Welcome to the API 1");
});

export const test_Users_Route_Get = describeTest(async (t) => {
  const response = await t.request("GET", "/users");
  t.assertResponse(response, 200);
  const users = extractJsonFromHttpResponse(response);
  t.assertEquals(users, {
    users: [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ],
  });
});

export const test_Non_Existent_Route = describeTest(async (t) => {
  const response = await t.request("GET", "/nonexistent");
  t.assertResponse(response, 404, "Non-existent route should return 404");
});
