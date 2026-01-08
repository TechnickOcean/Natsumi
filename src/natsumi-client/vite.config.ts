import UnocssPlugin from "@unocss/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin(), UnocssPlugin()],
  server: {
    port: 1337,
  },
  build: {
    target: "esnext",
  },
});
