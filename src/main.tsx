import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TorrentProvider } from "./providers/TorrentProvider.tsx";
import { UtilsProvider } from "./providers/UtilsProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UtilsProvider>
      <TorrentProvider>
        <App />
      </TorrentProvider>
    </UtilsProvider>
  </React.StrictMode>
);
