import axios, { AxiosError, AxiosResponse } from "axios";
import { COOKIE } from "@/utils/constants/cookie.type";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

// Create an instance of Axios with default configuration
export const axiosAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAPI.interceptors.request.use(
  (config) => {
    const accessToken = getCookie(COOKIE.TOKEN, { cookies });
    console.log("ACCESS TOKEN", accessToken);
    config.headers["Authorization"] = `Bearer ${accessToken}`;
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
    if (error.response?.status === 401) {
      throw new Error("Unauthorized, Please logout and login again.");
    }

    return Promise.reject(error);
  }
);
