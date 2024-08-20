"use server";

import { VendorUser } from "@/prisma-types";
import { get, patch, post } from "@/utils/api";
import { BaseResponse } from "@/utils/constants/response.type";
import {
  TAccountCreateRequest,
  TAccountUpdateRequest,
} from "@/utils/models/account.model";

export const updateAccount = async (
  id: string,
  data: TAccountUpdateRequest
): Promise<BaseResponse> => {
  const res = await patch<BaseResponse, TAccountUpdateRequest>(
    `vendor-user/${id}`,
    data
  );

  return res;
};

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

export const getProfile = async (): Promise<BaseResponse<VendorUser>> => {
  const res = await get<VendorUser>("vendor-user/profile");

  return res;
};
