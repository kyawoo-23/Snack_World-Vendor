import { axiosAPI } from "@/utils/api/config";
import { BaseResponse } from "@/utils/constants/response.type";

export const createAccount = async (data: unknown): Promise<BaseResponse> => {
  const res = await axiosAPI.post<BaseResponse>("vendor-user", data);
  return res.data;
};

export const toggleAccountStatus = async (
  id: string
): Promise<BaseResponse> => {
  const res = await axiosAPI.patch<BaseResponse>(
    `vendor-user/${id}/toggle-status`
  );

  return res.data;
};
