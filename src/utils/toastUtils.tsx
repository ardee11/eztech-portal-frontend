import { toast, ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: false,
  theme: "custom",
  className: "text-xs rounded-md border border-gray-300 bg-white shadow-md text-gray-600",
};

export function showToast(
  message: string,
  type: "success" | "error" | "warning"
) {
  if (type === "success") {
    toast.success(message, defaultOptions);
  } else if (type === "error") {
    toast.error(message, defaultOptions);
  } else if (type === "warning") {
    toast.warn(message, defaultOptions);
  }
}
