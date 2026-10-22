import { useContext } from "react";
import { ToastStateContext } from "./ToastContext";
import Toast from "./Toast";
const ToastContainer = () => {
  const state = useContext(ToastStateContext);
  if(state == null) throw new Error("Toast must be used within a ToastProvider.");

  const { visible } = state;
  if (visible.length === 0) return null;
  //   const pending = state.pending;

  return (
    <div className="toastContainer">
      {visible.map((toast) => (
        <Toast
          id={toast.id}
          key={toast.id}
          message={toast.message}
          persistent={toast.persistent}
          duration={toast.duration}
          type={toast.type}
        ></Toast>
      ))}
    </div>
  );
};

export default ToastContainer;
