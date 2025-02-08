import { Accessor, createSignal, Setter } from "solid-js"

export type FetchReturn<T> = [
  Accessor<T | Response>,
  Setter<T | Response>,
  utils: {
    refresh: VoidFunction,
    abort: VoidFunction,
    status: Accessor<string>,
    error: Accessor<string | null>
  }
]

export type FetchStatus = "loading" | "success" | "error";
export type FetchError = string | null;

export default function useFetch<T>(url: RequestInfo | URL): FetchReturn<T>;
export default function useFetch<T>(url: RequestInfo | URL, options: RequestInit): FetchReturn<T>;
export default function useFetch<T = string>(url: RequestInfo | URL, options?: RequestInit): FetchReturn<T> {
  const [response, setResponse] = createSignal<T | Response>({} as T);
  const [status, setStatus] = createSignal<FetchStatus>("loading");
  const [error, setError] = createSignal<FetchError>(null);
  let controller = new AbortController();

  function refresh() {
    setStatus("loading");
    setError(null);
    fetchResource();
  }

  function abort() {
    controller.abort();
  }
  
  async function formatResponse(response: Response): Promise<T | Response> {
    const contentType = response.headers.get("content-type");

    let formattedResponse;

    if (contentType?.includes("application/json")) {
      formattedResponse = await response.json();
    } else if (contentType?.includes("multipart/form-data")) {
      formattedResponse = await response.formData();
    } else if (contentType?.includes("text")) {
      formattedResponse = await response.text();
    } else if (contentType?.includes("application/octet-stream")) {
      const contentDisposition = response.headers.get("content-disposition");

      if (contentDisposition?.includes("attachment") || contentDisposition?.includes("filename")) {
        formattedResponse = await response.blob();
      } else {
        formattedResponse = await response.arrayBuffer();
      }
    } else {
      return response as Response;
    }

    return formattedResponse;
  }

  async function fetchResource() {
    controller = new AbortController();
    options = {...options, signal: controller.signal};

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await formatResponse(response);
      setResponse(data as Exclude<T, Function>);
      setStatus("success");
    } catch (error: unknown) {
      if(error instanceof Error) {
        setError(String(error.message));
        setStatus("error");
      }
    }
  }

  fetchResource();

  return [
    response,
    setResponse,
    { 
      refresh,
      abort,
      status,
      error 
    }
  ];
}