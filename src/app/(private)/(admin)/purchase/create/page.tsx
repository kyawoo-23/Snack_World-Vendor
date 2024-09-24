import MainLayout from "@/components/Layout/MainLayout";
import PurchaseCreateForm from "@/components/pages/purchase/PurchaseCreateForm";
import { get } from "@/utils/api";
import { TProductDetailsResponse } from "@/utils/models/product.model";

export default async function page() {
  const { data: products } = await get<TProductDetailsResponse[]>("/product");

  return (
    <MainLayout title='Purchase Product'>
      <PurchaseCreateForm products={products} />
    </MainLayout>
  );
}
