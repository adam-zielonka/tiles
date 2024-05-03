document.querySelector("#noscript")?.remove();

import React from "react";
import ReactDOM from "react-dom/client";
import { Tiles } from "./components/tiles";

import.meta.glob("./styles/*.scss", { eager: true });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Tiles/>
  </React.StrictMode>,
);
