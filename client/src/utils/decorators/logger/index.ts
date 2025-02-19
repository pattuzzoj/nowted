export default function Logger() {
  return function (_target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      console.log(`Calling ${key} with arguments: ${args.join(", ")}`);
      const result = originalMethod.apply(this, args);
      console.log(`Result of ${key}: ${result}`);
      return result;
    }
  }
}