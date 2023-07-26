import React from "react";
import ReactDOM from "react-dom/client";
import { Terminal } from "./components/terminal";

const urlParams = new URLSearchParams(window.location.search);

if (!urlParams.has("noscript")) {
  document.querySelector("#noscript")?.remove();

  import.meta.glob("./styles/*.scss", { eager: true });

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Terminal />
    </React.StrictMode>,
  );
}
