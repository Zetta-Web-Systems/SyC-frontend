import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "@app/providers/QueryProvider";
import SyCApp from "./SyCApp.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <SyCApp />
    </QueryProvider>
  </StrictMode>,
);
