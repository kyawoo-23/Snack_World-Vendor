"use server";

import { patch, post } from "@/utils/api";
import { BaseResponse } from "@/utils/constants/response.type";
import { TAccountCreateRequest } from "@/utils/models/account.model";

export const createAccount = async (
  data: TAccountCreateRequest
): Promise<BaseResponse> => {
  const res = await post<BaseResponse, TAccountCreateRequest>(
    "vendor-user",
    data
  );

  return res;
};

export const toggleAccountStatus = async (
  id: string
): Promise<BaseResponse> => {
  const res = await patch<BaseResponse>(`vendor-user/${id}/toggle-status`);

  return res;
};

export const resetAccountPassword = async (
  id: string
): Promise<BaseResponse> => {
  const res = await patch<BaseResponse>(`vendor-user/${id}/reset-password`);

  return res;
};
