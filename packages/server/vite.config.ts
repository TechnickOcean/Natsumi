import build from "@hono/vite-build/node";
import devServer from "@hono/vite-dev-server";
import { defineConfig, type PluginOption } from "vite";

export default defineConfig({
  plugins: [
    build({
      entry: "./src/index.ts",
    }) as PluginOption,
    devServer({
      entry: "./src/index.ts",
    }) as PluginOption,
  ],
});
