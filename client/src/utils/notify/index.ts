import { sleep } from "@utilify/core";
import toast from "solid-toast";

const notifyActions: {
  success: (message: string) => string;
  loading: (message: string) => string;
  error: (message: string) => string;
} = {} as any;

notifyActions.loading = (message: string = "Loading") =>
  toast.loading(message, {
    duration: 1000,
    position: "bottom-right",
    className:
      "text-black! dark:text-white! bg-zinc-800! dark:bg-zinc-100 rounded-lg!",
    iconTheme: {
      primary: "#155DFC",
    },
  });

notifyActions.success = (message: string = "Successfully") =>
  toast.success(message, {
    duration: 1000,
    position: "bottom-right",
    className:
      "text-black! dark:text-white! bg-zinc-800! dark:bg-zinc-100 rounded-lg!",
    iconTheme: {
      primary: "#155DFC",
    },
  });

notifyActions.error = (message: string = "Something went wrong") =>
  toast.error(message, {
    duration: 1000,
    position: "bottom-right",
    className:
      "text-black! dark:text-white! bg-zinc-800! dark:bg-zinc-100 rounded-lg!",
    iconTheme: {
      primary: "#E7000B",
    },
  });

export const notify = {
  success: (message: string) => notifyActions["success"]?.(message),
  loading: (message: string) => notifyActions["loading"]?.(message),
  error: (message: string) => notifyActions["error"]?.(message),
  promise: async <T>(
    promise: () => Promise<T | void>,
    message: {
      loading: string;
      success: string;
      error: string;
    } = {
      loading: "Loading",
      success: "Successfully",
      error: "Something went wrong",
    }
  ) => {
    let notifyId = notify.loading(message.loading);
    await sleep(800);

    try {
      const result = await promise();

      toast.dismiss(notifyId);
      notify.success(message.success);

      return result;
    } catch (error) {
      notify.error(message.error);
      console.log(error);
      throw error;
    }
  },
};

export function Notify(message: {
  loading: string;
  success: string;
  error: string;
}) {
  return function (_target: any, _key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return await notify.promise(async () => originalMethod.apply(this, args), message);
    };

    return descriptor;
  };
}
