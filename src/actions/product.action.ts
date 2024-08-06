"use server";

import { patch, post, remove } from "@/utils/api";
import { BaseResponse } from "@/utils/constants/response.type";
import { utapi } from "@/utils/library/uploadthing";
import {
  TProductCreateRequest,
  TProductCreateRequestVM,
  TProductUpdateRequest,
  TProductUpdateRequestVM,
} from "@/utils/models/product.model";

export const toggleProductStatus = async (
  id: string
): Promise<BaseResponse> => {
  const res = await patch<BaseResponse, { status: boolean }>(
    `product/${id}/toggle-status`
  );

  return res;
};

export const updateProductDetails = async (
  id: string,
  data: TProductUpdateRequestVM,
  primaryImageKey?: string,
  formData?: FormData
): Promise<BaseResponse> => {
  const primaryImage = formData?.get("primaryImage") as File;
  if (primaryImage) {
    if (primaryImageKey) {
      const deleted = await utapi.deleteFiles(primaryImageKey);
      if (!deleted) {
        return {
          isSuccess: false,
          message: "Failed to delete image",
          error: "Error deleting in UTAPI",
        };
      }
    }

    const primaryImgRes = await utapi.uploadFiles(primaryImage);
    const res = await patch<BaseResponse, TProductUpdateRequest>(
      `product/${id}`,
      {
        ...data,
        price: parseFloat(data.price.toString()),
        weight: parseFloat(data.weight.toString()),
        promotionPrice: parseFloat(data.promotionPrice?.toString() ?? "0"),
        primaryImage: primaryImgRes.data?.url,
      }
    );

    return res;
  }

  const res = await patch<BaseResponse, TProductUpdateRequest>(
    `product/${id}`,
    {
      ...data,
      price: parseFloat(data.price.toString()),
      weight: parseFloat(data.weight.toString()),
      promotionPrice: parseFloat(data.promotionPrice?.toString() ?? "0"),
    }
  );

  return res;
};

export const addProductImage = async (
  id: string,
  formData: FormData
): Promise<BaseResponse> => {
  const productImages = formData.getAll("productImages") as File[];
  const productImagesRes = await Promise.all(
    productImages.map((file) => utapi.uploadFiles(file))
  );

  const res = await post<BaseResponse, { productImages: string[] }>(
    `product-image/${id}`,
    {
      productImages: productImagesRes
        .map((res) => res.data?.url)
        .filter((url): url is string => url !== undefined),
    }
  );

  return res;
};

export const deleteProductImage = async (
  id: string,
  key: string
): Promise<BaseResponse> => {
  const deleted = await utapi.deleteFiles(key);

  if (!deleted) {
    return {
      isSuccess: false,
      message: "Failed to delete image",
      error: "Error deleting in UTAPI",
    };
  }

  const res = await remove<BaseResponse>(`product-image/${id}`);
  return res;
};

export const createProduct = async (
  data: TProductCreateRequestVM,
  formData: FormData
): Promise<BaseResponse> => {
  const primaryImage = formData.get("primaryImage") as File;
  const primaryImgRes = await utapi.uploadFiles(primaryImage);

  const productImages = formData.getAll("productImages") as File[];
  const productImagesRes = await Promise.all(
    productImages.map((file) => utapi.uploadFiles(file))
  );

  const res = await post<BaseResponse, TProductCreateRequest>("product", {
    ...data,
    price: parseFloat(data.price.toString()),
    weight: parseFloat(data.weight.toString()),
    vendorId: process.env.NEXT_PUBLIC_VENDOR_ID || "",
    primaryImage: primaryImgRes.data?.url,
    productImages: productImagesRes
      .map((res) => res.data?.url)
      .filter((url): url is string => url !== undefined),
  });

  return res;
};
