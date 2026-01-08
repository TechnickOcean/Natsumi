import { shuki } from "@natsumi/shared";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors());

app.get("/", (c) => {
  return c.text(`Hello Hono! ${shuki}`);
});

export default app;
