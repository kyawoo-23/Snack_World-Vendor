import ProductCreateForm from "@/components/pages/product/ProductCreateForm";
import MainLayout from "@/components/Layout/MainLayout";
import { axiosAPI } from "@/utils/api/config";
import { BaseResponse } from "@/utils/constants/response.type";
import { Category, Variant } from "@/prisma-types";

export default async function page() {
  const {
    data: { data: categories },
  } = await axiosAPI.get<BaseResponse<Category[]>>("category");
  const {
    data: { data: variants },
  } = await axiosAPI.get<BaseResponse<Variant[]>>("variant");

  return (
    <MainLayout title='Create new product'>
      <ProductCreateForm categories={categories} variants={variants} />
    </MainLayout>
  );
}
