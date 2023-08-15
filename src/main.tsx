document.querySelector("#noscript")?.remove();

import React from "react";
import ReactDOM from "react-dom/client";
import { Terminal } from "./components/terminal";
import { Tiles } from "./tiles/tiles";

import.meta.glob("./styles/*.scss", { eager: true });

const urlPrams = new URLSearchParams(window.location.search);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {urlPrams.has("tiles") && <Tiles/> || <Terminal />}
  </React.StrictMode>,
);
