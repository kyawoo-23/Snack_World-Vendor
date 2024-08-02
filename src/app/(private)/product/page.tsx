import MainLayout from "@/components/Layout/MainLayout";
import ProductList from "@/components/pages/product/ProductList";
import { Product } from "@/prisma-types";
import { get } from "@/utils/api";

export default async function page() {
  const { data: products } = await get<Product[]>("/product");

  return (
    <MainLayout
      title='Products'
      action={{
        label: "Create Product",
        href: "/product/create",
      }}
    >
      <ProductList products={products ?? []} />
    </MainLayout>
  );
}
