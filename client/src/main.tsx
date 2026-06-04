import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// React Flow / browsers can emit a benign "ResizeObserver loop" error that gets
// reported as an uncaught exception. Suppress it so it doesn't trip crash detection.
const isResizeObserverError = (value: unknown) => {
  const msg =
    typeof value === "string"
      ? value
      : value instanceof Error
      ? value.message
      : "";
  return msg.includes("ResizeObserver loop");
};

window.addEventListener("error", (event) => {
  if (isResizeObserverError(event.message) || isResizeObserverError(event.error)) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
});

window.addEventListener("unhandledrejection", (event) => {
  if (isResizeObserverError(event.reason)) {
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
