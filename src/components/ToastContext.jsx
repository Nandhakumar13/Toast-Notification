import { createContext, useCallback } from "react";
import { toastReducer, initialState } from "./ToastReducer";

export const ToastApiContext = createContext();
export const ToastStateContext = createContext();

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
      (options.duration !== "number" ||
        !Number.isFinite(options.duration) ||
        options.duration <= 0)
    ) {
      throw new Error("Duration Value must be finite numerical value");
    }

    if (
      options.persistant !== undefined &&
      typeof options.persistant !== "boolean"
    ) {
      throw new Error("Persistant value should contain boolean value");
    }
  }, []);

  // toast creation
  const createToast = useCallback(() => {
    (type, message, options = {}) => {
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
        persistant: options.persistant ?? false,
      };

      dispatch({ type: "ADD_TOAST", payload: toast });

      return id;
    };
  }, [validateNotification]);

  // individual notfication event handlers
  const success = useCallback(
    (message, options) => {
      createToast("success", message, options);
    },
    [createToast],
  );

  const error = useCallback(
    (message, options) => {
      createToast("error", message, options);
    },
    [createToast],
  );

  const warning = useCallback(
    (message, options) => {
      createToast("warning", message, options);
    },
    [createToast],
  );

  const info = useCallback(
    (message, options) => {
      createToast("info", message, options);
    },
    [createToast],
  );

  // toast deletion

  const dismiss = useCallback((id) => {
    if (typeof id !== "string" || id.length === 0) {
      throw new Error("A valid toast ID is required");
    }

    dispatch({ action: "REMOVE_TOAST", payload: { id } });
  }, []);

  const toastApi = useMemo(
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
