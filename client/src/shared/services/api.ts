import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({baseURL: 'https://nowted-server.vercel.app', validateStatus: (status) => {
  return status > 199 && status < 300;
}});

api.interceptors.request.use(config => {
  if (!window.navigator.onLine) {
    return Promise.reject({
      isAxiosError: true,
      code: "ERR_OFFLINE",
      message: "Network Error: You are currently offline. Please check your internet connection.",
      config,
    });
  }

  let AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");

  if (AUTH_TOKEN) {
    config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
  };

  return config;
});

api.interceptors.response.use((response) => response, async (error: AxiosError) => {
  if (error.response?.status === 401) {
    try {
      const {data} = await axios.post("/auth/refresh-token", {}, {withCredentials: true});
      localStorage.setItem("AUTH_TOKEN", data.accessToken);
  
      return api.request(error.config as InternalAxiosRequestConfig);
    } catch (error) {
      localStorage.removeItem("AUTH_TOKEN");
      window.location.href = "/auth/login";
    }
  }

  return Promise.reject(error);
});

export default api;
