import { sleep } from "@utilify/core";
import toast from "solid-toast";

export default class NotifyService {
  private static instance: NotifyService;

  private constructor() {}

  static getInstance() {
    if (!NotifyService.instance) {
      NotifyService.instance = new NotifyService();
    }

    return NotifyService.instance;
  }

  public loading(message: string = "Loading") {
    return toast.loading(message, {
      duration: Infinity,
      position: "bottom-right",
      className:
        "text-black! dark:text-white! bg-zinc-800! dark:bg-zinc-100 rounded-lg!",
      iconTheme: {
        primary: "#155DFC",
      },
    });
  }

  public success(message: string = "Successfully") {
    return toast.success(message, {
      duration: 1000,
      position: "bottom-right",
      className:
        "text-black! dark:text-white! bg-zinc-800! dark:bg-zinc-100 rounded-lg!",
      iconTheme: {
        primary: "#155DFC",
      },
    });
  }

  public error(message: string = "Something went wrong") {
    return toast.error(message, {
      duration: 1000,
      position: "bottom-right",
      className:
        "text-black! dark:text-white! bg-zinc-800! dark:bg-zinc-100 rounded-lg!",
      iconTheme: {
        primary: "#E7000B",
      },
    });
  }

  public async promise<T>(
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
  ) {
    let notifyId = this.loading(message.loading);
    await sleep(300);

    try {
      const result = await promise();
      toast.dismiss(notifyId);
      this.success(message.success);
      return result;
    } catch (error) {
      this.error(message.error);
      throw error;
    } finally {
      toast.dismiss(notifyId);
    }
  }
}
