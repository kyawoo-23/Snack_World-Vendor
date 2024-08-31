"use server";

import { VendorUser } from "@/prisma-types";
import { get, patch, post } from "@/utils/api";
import { BaseResponse } from "@/utils/constants/response.type";
import {
  TAccountCreateRequest,
  TAccountUpdateRequest,
  TVendorLogoUpdateRequest,
} from "@/utils/models/account.model";
import { utapi } from "@/utils/library/uploadthing";

export const updateVendorLogo = async (
  imageKey?: string,
  formData?: FormData
): Promise<BaseResponse> => {
  const newLogo = formData?.get("image") as File;
  if (newLogo) {
    if (imageKey) {
      const deleted = await utapi.deleteFiles(imageKey);
      if (!deleted) {
        return {
          isSuccess: false,
          message: "Failed to delete image",
          error: "Error deleting in UTAPI",
        };
      }
    }

    const uploadedLogo = await utapi.uploadFiles(newLogo);

    const res = await patch<BaseResponse, TVendorLogoUpdateRequest>(
      "vendor/update-logo",
      {
        image: uploadedLogo.data?.url,
      }
    );

    return res;
  }
  return {
    isSuccess: false,
    message: "No image found",
    error: "No image found",
  };
};

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
