import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";


import { ToastProvider } from "./components/ToastContext.jsx";
import ToastContainer from "./components/ToastContainer.jsx";

createRoot(document.getElementById("root")).render(
  <ToastProvider>
    <App />
    <ToastContainer />
  </ToastProvider>,
);
