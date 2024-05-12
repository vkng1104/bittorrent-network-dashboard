import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TorrentProvider } from "./providers/TorrentProvider.tsx";
import { UtilsProvider } from "./providers/UtilsProvider.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <UtilsProvider>
      <TorrentProvider>
        <App />
      </TorrentProvider>
    </UtilsProvider>
  </React.StrictMode>
);
