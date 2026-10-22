import { useContext, useEffect } from "react";
import { ToastAPIContext } from "./ToastContext";
import "./toast.css";
const Toast = ({ id, message, type, duration, persistent }) => {

  const toastAPI = useContext(ToastAPIContext);

  if (!toastAPI) {
    throw new Error("Toast must be used within a ToastProvider.");
  }

  const { dismiss } = toastAPI;

  useEffect(() => {
    if (persistent) return;

    const timer = setTimeout(() => {
      dismiss(id);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [id, duration, persistent, dismiss]);

  return (
    <div
      className={`toast toast-${type}`}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      <span>{message}</span>
      <button className="toast-close" onClick={() => dismiss(id)}>
        Close
      </button>
    </div>
  );
};

export default Toast;
