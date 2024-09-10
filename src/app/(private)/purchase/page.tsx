import MainLayout from "@/components/Layout/MainLayout";
import PurchaseList from "@/components/pages/purchase/PurchaseList";
import { VendorPurchase } from "@/prisma-types";
import { get } from "@/utils/api";

export default async function page() {
  const { data: purchases } = await get<VendorPurchase[]>("vendor-purchase");

  return (
    <MainLayout
      title='Purchases'
      action={{
        label: "Purchase Product",
        href: "/purchase/create",
      }}
    >
      <PurchaseList purchases={purchases} />
    </MainLayout>
  );
}
