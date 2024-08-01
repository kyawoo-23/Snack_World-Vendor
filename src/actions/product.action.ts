"use server";

import { post } from "@/utils/api";
import { BaseResponse } from "@/utils/constants/response.type";
import { utapi } from "@/utils/library/uploadthing";
import { TProductCreateRequest } from "@/utils/models/product.model";
import { configConsumerProps } from "antd/es/config-provider";

export const createProduct = async (
  data: TProductCreateRequest,
  formData: FormData
): Promise<BaseResponse> => {
  const primaryImage = formData.get("primaryImage") as File;
  const primaryImgRes = await utapi.uploadFiles(primaryImage);

  const productImages = formData.getAll("productImages") as File[];
  const productImagesRes = await Promise.all(
    productImages.map((file) => utapi.uploadFiles(file))
  );

  const res = await post<BaseResponse>("product", {
    ...data,
    price: parseFloat(data.price.toString()),
    weight: parseFloat(data.weight.toString()),
    vendorId: process.env.NEXT_PUBLIC_VENDOR_ID,
    primaryImage: primaryImgRes.data?.url,
    productImages: productImagesRes
      .map((res) => res.data?.url)
      .filter((url): url is string => url !== undefined),
  });

  return res;
};
