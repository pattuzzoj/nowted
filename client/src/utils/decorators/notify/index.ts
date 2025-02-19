import NotifyService from "@services/notify";

const notifyService = NotifyService.getInstance();

export function Notify(message: {
  loading: string;
  success: string;
  error: string;
}) {
  return function (_target: any, _key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return await notifyService.promise(async () => originalMethod.apply(this, args), message);
    };

    return descriptor;
  };
}