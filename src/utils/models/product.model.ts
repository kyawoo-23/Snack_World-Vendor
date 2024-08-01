import { UploadProps } from "antd";

export type TProductCreateRequest = {
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
