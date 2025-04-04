export function debounce<T>(
  callback: (...args: any[]) => Promise<T>,
  delay: number = 300
): (...args: any[]) => Promise<T> {
  let timerId: number;

  return (...args: any[]): Promise<T> => {
    return new Promise(async (resolve) => {
      clearTimeout(timerId);
      timerId = setTimeout(async () => {
        resolve(await callback(...args));
      }, delay) as unknown as number;
    });
  };
}
