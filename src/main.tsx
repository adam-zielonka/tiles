document.querySelector("#noscript")?.remove();

import React from "react";
import ReactDOM from "react-dom/client";
import { Terminal } from "./components/terminal";

import.meta.glob("./styles/*.scss", { eager: true });
import "./main.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Terminal />
  </React.StrictMode>,
);
