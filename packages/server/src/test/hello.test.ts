import { testClient } from "hono/testing";
import { expect, test } from "vitest";
import app from "../index";

test("hello", async () => {
  const res = await testClient(app).hello.$get({ query: { name: "Nick" } });
  expect(await res.text()).toBe("Hello Nick!");
});
