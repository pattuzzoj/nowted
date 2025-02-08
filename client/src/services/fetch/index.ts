class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchError";
  }
}

export default class FetchService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(url: string, options: RequestInit): Promise<T | undefined> {
    try {
      const request = await fetch(this.baseUrl.concat(url), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        mode: "cors",
        ...options
      });

      const data = await request.json();

      if (!request.ok) {
        throw new FetchError(data.error);
      }

      return data.data;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }
}