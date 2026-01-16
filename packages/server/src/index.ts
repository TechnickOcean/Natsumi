import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import helloApp from "./routes/hello";

const app = new Hono()
  .use(cors())
  .use(logger())
  .get("/", (c) => {
    return c.text(`Hello Hono!`);
  })
  .route("/hello", helloApp);

export type AppType = typeof app;
export default app;
