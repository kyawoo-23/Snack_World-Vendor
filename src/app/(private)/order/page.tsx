import MainLayout from "@/components/Layout/MainLayout";
import OrderList from "@/components/pages/order/OrderList";
import { CustomerOrderVendor } from "@/prisma-types";
import { get } from "@/utils/api";

export default async function page() {
  const { data: orders } = await get<CustomerOrderVendor[]>(
    "customer-order-vendor"
  );

  return (
    <MainLayout title='Orders'>
      <OrderList orders={orders ?? []} />
    </MainLayout>
  );
}
