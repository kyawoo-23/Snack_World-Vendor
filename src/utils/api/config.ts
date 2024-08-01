import axios, { AxiosError, AxiosResponse } from "axios";

// Create an instance of Axios with default configuration
export const axiosAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAPI.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer `;
    // console.log("Config: ", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosAPI.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log("Success:", response);
    return response;
  },
  (error: AxiosError) => {
    console.log("Error: ", error);
    return Promise.reject(error);
  }
);
