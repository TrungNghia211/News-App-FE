import { toast } from "react-toastify";

const useCustomToast = () => {
  const showToast = (message: string, type: "success" | "error" | "info" | "warning") => {
    toast(message, { type });
  };

  return {
    showToast,
    success: (message: string) => showToast(message, "success"),
    error: (message: string) => showToast(message, "error"),
    info: (message: string) => showToast(message, "info"),
    warning: (message: string) => showToast(message, "warning"),
  };
};

export default useCustomToast;
