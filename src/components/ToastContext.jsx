import { createContext, useCallback, useMemo,useReducer } from "react";
import { toastReducer, initialState } from "./ToastReducer";

export const ToastAPIContext = createContext(null);
export const ToastStateContext = createContext(null);

const defaultDuration = 5000; // 5seconds
const msgTypes = new Set(["success", "error", "warning", "info"]);

// provider
export function ToastProvider({ children }) {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  // validate notification
  const validateNotification = useCallback((message, options = {}) => {
    if (typeof message !== "string" || message.trim().length === 0) {
      throw new Error("Toast message must be non-empty string");
    }

    if (
      options.duration !== undefined &&
      (typeof options.duration !== "number" ||
        !Number.isFinite(options.duration) ||
        options.duration <= 0)
    ) {
      throw new Error("Duration Value must be finite numerical value");
    }

    if (
      options.persistent !== undefined &&
      typeof options.persistent !== "boolean"
    ) {
      throw new Error("persistent value should contain boolean value");
    }
  }, []);

  // toast creation
  const createToast = useCallback((type,message,options = {}) => {
   
      if (!msgTypes.has(type)) {
        throw new Error(`Unsupported toast type: ${type}`);
      }

      validateNotification(message, options);

      const id = crypto.randomUUID();

      const toast = {
        id,
        type,
        message: message.trim(),
        duration: options.duration ?? defaultDuration,
        persistent: options.persistent ?? false,
      };

      dispatch({ type: "ADD_TOAST", payload: toast });

      return id;
  }, [validateNotification]);

  // individual notfication event handlers
  const success = useCallback(
    (message, options) => {
      return createToast("success", message, options);
    },
    [createToast],
  );

  const error = useCallback(
    (message, options) => {
      return createToast("error", message, options);
    },
    [createToast],
  );

  const warning = useCallback(
    (message, options) => {
      return createToast("warning", message, options);
    },
    [createToast],
  );

  const info = useCallback(
    (message, options) => {
      return createToast("info", message, options);
    },
    [createToast],
  );

  // toast deletion

  const dismiss = useCallback((id) => {
    if (typeof id !== "string" || id.trim().length === 0) {
      throw new Error("A valid toast ID is required");
    }

    dispatch({ type: "REMOVE_TOAST", payload: { id } });
  }, []);

  const toastAPI = useMemo(
    () => ({
      success,
      warning,
      error,
      info,
      dismiss,
    }),
    [success, warning, error, info, dismiss],
  );

  return (
    <ToastAPIContext.Provider value={toastAPI}>
      <ToastStateContext.Provider value={state}>
        {children}
      </ToastStateContext.Provider>
    </ToastAPIContext.Provider>
  );
}
