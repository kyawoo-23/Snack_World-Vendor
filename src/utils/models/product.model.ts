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
  vendorId: string;
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
  vendorId: string;
};
