import { defineTest, extractJsonFromHttpResponse } from "zoltra";

export const testHomeRouteGet = defineTest(async (t) => {
  await t.inject("GET", "/", (req, res, next) => {
    res.status(200).json({ message: "Welcome to the API" });
    next();
  });
  const response = await t.simulateRequest("GET", "/");
  t.assertResponse(response, 200);
  const res = extractJsonFromHttpResponse(response);
  t.assertContains(res, { message: "Welcome to the API" });
});

export const testUsersRouteGet = defineTest(async (t) => {
  const response = await t.simulateRequest("GET", "/users");
  t.assertResponse(response, 200);
  const users = extractJsonFromHttpResponse(response);
  t.assertEquals(users, {
    users: [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ],
  });
});

export const testNonExistentRoute = defineTest(async (t) => {
  const response = await t.simulateRequest("GET", "/nonexistent");
  t.assertResponse(response, 404, "Non-existent route should return 404");
});
