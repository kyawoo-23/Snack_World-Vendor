import { axiosAPI } from "@/utils/api/config";
import { BaseResponse } from "@/utils/constants/response.type";

export const get = async <T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<BaseResponse<T>> => {
  const { data } = await axiosAPI.get<BaseResponse<T>>(endpoint, { params });
  return data;
};

export const post = async <T, R = void>(
  endpoint: string,
  body?: R
): Promise<BaseResponse<T>> => {
  const { data } = await axiosAPI.post<BaseResponse<T>>(endpoint, body);
  return data;
};

export const patch = async <T, R = void>(
  endpoint: string,
  body?: R
): Promise<BaseResponse<T>> => {
  const { data } = await axiosAPI.patch<BaseResponse<T>>(endpoint, body);
  return data;
};

export const remove = async <T>(endpoint: string): Promise<BaseResponse<T>> => {
  const { data } = await axiosAPI.delete<BaseResponse<T>>(endpoint);
  return data;
};
