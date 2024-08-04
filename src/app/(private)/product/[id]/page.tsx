import MainLayout from "@/components/Layout/MainLayout";
import ProductCreateForm from "@/components/pages/product/ProductCreateForm";
import ProductDetails from "@/components/pages/product/ProductDetails";
import { Category, Product, Variant } from "@/prisma-types";
import { get } from "@/utils/api";

export default async function page({ params }: { params: { id: string } }) {
  const { data: product } = await get<Product>(`/product/${params.id}`);
  const { data: categories } = await get<Category[]>("category");
  const { data: variants } = await get<Variant[]>("variant");

  if (!product) return "No product found";
  console.log(product);

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
