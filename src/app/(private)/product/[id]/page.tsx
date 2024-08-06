import MainLayout from "@/components/Layout/MainLayout";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/pages/product/ProductDetails";
import { Category, Product, Variant } from "@/prisma-types";
import { get } from "@/utils/api";

export default async function page({ params }: { params: { id: string } }) {
  const { data: product } = await get<Product>(`/product/${params.id}`);
  const { data: categories } = await get<Category[]>("category");
  const { data: variants } = await get<Variant[]>("variant");

  if (!product) notFound();

  return (
    <MainLayout title={`${product.name} details`}>
      <ProductDetails
        categories={categories ?? []}
        variants={variants ?? []}
        initialValues={product}
      />
    </MainLayout>
  );
}
