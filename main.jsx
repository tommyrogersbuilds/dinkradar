import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DinkRadar from "./dinkradar.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DinkRadar />
  </StrictMode>
);
