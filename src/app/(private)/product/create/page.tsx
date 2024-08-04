import ProductCreateForm from "@/components/pages/product/ProductCreateForm";
import MainLayout from "@/components/Layout/MainLayout";
import { Category, Variant } from "@/prisma-types";
import { get } from "@/utils/api";

export default async function page() {
  const { data: categories } = await get<Category[]>("category");
  const { data: variants } = await get<Variant[]>("variant");

  return (
    <MainLayout title='Create new product'>
      <ProductCreateForm
        categories={categories ?? []}
        variants={variants ?? []}
      />
    </MainLayout>
  );
}
