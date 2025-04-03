export type FetchResponse<T> =
  {
      success: true;
      statusCode: number;
      message: string;
      data: T;
      timestamp: string;
    };

export default class FetchService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    url: string,
    options: RequestInit
  ): Promise<FetchResponse<T>> {
    try {
      if ("body" in options) {
        options.body = await this.serialize(options.body);
      }

      const response = await fetch(this.baseUrl.concat(url), {
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
        ...options,
      });

      const data = await this.deserialize(response);

      if (!response.ok) {
        throw data;
      }

      return data as FetchResponse<T>;
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private async serialize(data: any): Promise<string> {
    return JSON.stringify(data);
  }

  private async deserialize<T>(request: Response): Promise<T> {
    return request.json();
  }

  public async get<T>(url: string) {
    return await this.request<T>(url, {
      method: "GET",
    });
  }

  public async post(url: string, data: any) {
    return await this.request(url, {
      method: "POST",
      body: data,
    });
  }

  public async put(url: string, data: any) {
    return await this.request(url, {
      method: "PUT",
      body: data,
    });
  }

  public async patch(url: string, data: any) {
    return await this.request(url, {
      method: "PATCH",
      body: data,
    });
  }

  public async delete(url: string) {
    return await this.request(url, {
      method: "DELETE",
    });
  }
}
