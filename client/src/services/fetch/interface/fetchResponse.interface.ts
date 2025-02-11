export default interface FetchResponse<T> {
  status: "success" | "error";
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}