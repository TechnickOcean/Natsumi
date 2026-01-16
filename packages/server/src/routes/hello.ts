import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";

const helloApp = new Hono().get(
  "/",
  zValidator(
    "query",
    z.object({
      name: z.string(),
    })
  ),
  (c) => {
    const { name } = c.req.valid("query");
    return c.text(`Hello ${name}!`);
  }
);

export default helloApp;
