import type { AppType } from "@natsumi/server";
import { hc } from "hono/client";
import type { Component } from "solid-js";
import { createResource } from "solid-js";

const client = hc<AppType>("http://localhost:5173/");

const fetchKasumi = async () => {
  const natsukasumi = await client.index.$get();
  const hitomi = await natsukasumi.text();
  return hitomi;
};

const App: Component = () => {
  const [kasumi] = createResource(fetchKasumi);
  return (
    <span>
      <p class="text-blue text-5xl">Bin bon bang bon~</p>
      {kasumi() ?? "Loading..."}
    </span>
  );
};

export default App;
