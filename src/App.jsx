
import { useContext } from "react";
import { ToastAPIContext } from "./components/ToastContext";

function App() {
  const toast = useContext(ToastAPIContext);

  if (!toast) {
    throw new Error("App must be used within ToastProvider");
  }

  return (
    <div>
      <h1>Toast Notification Testing</h1>

      <button onClick={() => toast.success("Saved successfully!")}>
        Success
      </button>

      <button onClick={() => toast.error("Something went wrong!")}>
        Error
      </button>

      <button onClick={() => toast.warning("Please check your input.")}>
        Warning
      </button>

      <button onClick={() => toast.info("You have a new update.")}>
        Info
      </button>

      <button
        onClick={() =>
          toast.success("This notification stays until dismissed.", {
            persistent: true,
          })
        }
      >
        Persistent Toast
      </button>

      <button
        onClick={() => {
          toast.success("First notification");
          toast.info("Second notification");
          toast.warning("Third notification");
          toast.error("Fourth notification");
        }}
      >
        Test Queue (4 Toasts)
      </button>
    </div>
  );
}

export default App;
