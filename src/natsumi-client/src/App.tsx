import { shuki } from "@natsumi/shared";
import type { Component } from "solid-js";
import { createResource } from "solid-js";

const fetchKasumi = async () => {
  const natsukasumi = await fetch("http://localhost:5173/");
  const hitomi = await natsukasumi.text();
  return hitomi;
};

const App: Component = () => {
  const [kasumi] = createResource(fetchKasumi);
  return (
    <span>
      <p class="text-blue text-5xl">Bin bon bang bon~ Shared var should be: {shuki}</p>
      {kasumi() ?? "Loading..."}
    </span>
  );
};

export default App;
