import { sleep } from "@utilify/core";
import { batch, createEffect, createSignal } from "solid-js";
import toast from "solid-toast";

const notifyActions: {
  success: (message: string) => string,
  loading: (message: string) => string,
  error: (message: string) => string,
} = {} as any;

notifyActions.loading = (message: string = "Loading") => toast.loading(message, {
  duration: 1000,
  position: "bottom-right",
  className: "text-black! dark:text-white! bg-zinc-800! dark:bg-zinc-100 rounded-lg!",
  iconTheme: {
    primary: "#155DFC"
  }
});

notifyActions.success = (message: string = "Successfully") => toast.success(message, {
  duration: 1000,
  position: "bottom-right",
  className: "text-black! dark:text-white! bg-zinc-800! dark:bg-zinc-100 rounded-lg!",
  iconTheme: {
    primary: "#155DFC"
  }
});

notifyActions.error = (message: string = "Something went wrong") => toast.error(message, {
  duration: 1000,
  position: "bottom-right",
  className: "text-black! dark:text-white! bg-zinc-800! dark:bg-zinc-100 rounded-lg!",
  iconTheme: {
    primary: "#E7000B"
  }
});

type Status = "success" | "error" | "loading";

export default function useToast() {
  const [notifyId, setNotifyId] = createSignal<string | null>(null);
  const [status, setStatus] = createSignal<Status>("loading");

  const notify = {
    success: (message: string) => {
      notifyActions["success"]?.(message);

      batch(() => {
        setNotifyId(notifyId);
        setStatus(status);
      });
    },
    loading: (message: string) => {
      notifyActions["loading"]?.(message);

      batch(() => {
        setNotifyId(notifyId);
        setStatus(status);
      });
    },
    error: (message: string) => {
      notifyActions["error"]?.(message);

      batch(() => {
        setNotifyId(notifyId);
        setStatus(status);
      });
    },
    promise: async <T>(
      promise: () => Promise<T | void>,
      message: {
        loading: string,
        success: string,
        error: string
      } = {
        loading: "Loading",
        success: "Successfully",
        error: "Something went wrong"
      }
    ) => {
      notify.loading(message.loading);
      await sleep(800);

      try {
        const result = await promise();
        notify.success(message.success);
        return result;
      } catch {
        notify.error(message.error);
        return null;
      }
    }
  }

  createEffect((prevId) => {
    if(prevId) {
      toast.dismiss(prevId as string);
    }

    if(status() === "loading") {
      return notifyId();
    }

    return;
  });

  return notify;
}