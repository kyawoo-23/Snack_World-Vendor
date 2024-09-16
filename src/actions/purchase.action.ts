"use server";

import { post } from "@/utils/api";
import { BaseResponse } from "@/utils/constants/response.type";
import { TVendorPurchaseRequest } from "@/utils/models/purchase.model";
import { revalidatePath } from "next/cache";

export const vendorPurchaseProduct = async (
  data: TVendorPurchaseRequest
): Promise<BaseResponse> => {
  const res = await post<BaseResponse, TVendorPurchaseRequest>(
    `vendor-purchase`,
    data
  );

  revalidatePath("purchase");

  return res;
};
