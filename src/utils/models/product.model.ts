import {
  Category,
  Product,
  ProductVariant,
  Variant,
  Vendor,
} from "@/prisma-types";
import { UploadProps } from "antd";

export type TProductCreateRequestVM = {
  name: string;
  price: number;
  description: string;
  categoryId: string;
  productVariants: string[];
  weight: number;
  primaryImage?: UploadProps;
  productImages?: UploadProps;
};

export type TProductCreateRequest = {
  name: string;
  price: number;
  description: string;
  categoryId: string;
  productVariants: string[];
  weight: number;
  primaryImage?: string;
  productImages?: string[];
};

export type TProductUpdateRequestVM = {
  name: string;
  price: number;
  description: string;
  categoryId: string;
  productVariants: string[];
  weight: number;
  promotion?: boolean;
  promotionPrice?: number;
};

export type TProductUpdateRequest = {
  name: string;
  price: number;
  description: string;
  categoryId: string;
  productVariants: string[];
  weight: number;
  promotion?: boolean;
  promotionPrice?: number;
  primaryImage?: string;
};

type TProductVariant = ProductVariant & { variant: Variant };

export type TProductDetailsResponse = Product &
  Category &
  Vendor &
  TProductVariant;
