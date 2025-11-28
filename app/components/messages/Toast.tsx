import toast, { Toaster, ToastOptions } from "react-hot-toast";

type ToastType = "success" | "error" | "warning" | "default";

interface ToastOptionsExtended extends ToastOptions {
  type?: ToastType;
}

const playSuccessSound = () => {
  const audio = new Audio('/sounds/success.mp3')
  audio.volume = 0.5
  audio.play().catch(e => console.log("Error al reproducir el sonido", e))
}

const toastHandler = (message: string, options?: ToastOptionsExtended) => {
  const { type = "default", ...rest } = options || {};
  
  const toastOptions: ToastOptions = {
    duration: 3000,
    position: "bottom-left",
    ...rest,
  };

  if (type === 'success') {
    playSuccessSound()
  }

  switch (type) {
    case "success":
      return toast.success(message, toastOptions);
    case "error":
      return toast.error(message, toastOptions);
    case "warning":
      return toast(message, { ...toastOptions, icon: "⚠️" });
    default:
      return toast(message, toastOptions);
  }
};

// Export the toast handler and Toaster component
export { Toaster, toastHandler as toast };

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-left"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
        },
        error: {
          duration: 4000,
        },
      }}
    />
  );
}