"use server";

import { post } from "@/utils/api";
import { BaseResponse } from "@/utils/constants/response.type";
import { TVendorPurchaseRequest } from "@/utils/models/purchase.model";

export const vendorPurchaseProduct = async (
  data: TVendorPurchaseRequest
): Promise<BaseResponse> => {
  const res = await post<BaseResponse, TVendorPurchaseRequest>(
    `vendor-purchase`,
    data
  );

  return res;
};
