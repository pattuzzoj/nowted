export default interface FetchResponse<T> {
  status: "success" | "error";
  message: string;
  data: T | null;
}