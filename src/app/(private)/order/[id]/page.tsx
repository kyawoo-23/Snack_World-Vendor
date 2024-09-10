import MainLayout from "@/components/Layout/MainLayout";
import OrderDetails from "@/components/pages/order/OrderDetails";
import { CustomerOrderVendor } from "@/prisma-types";
import { get } from "@/utils/api";
import { notFound } from "next/navigation";

export default async function page({ params }: { params: { id: string } }) {
  const { data } = await get<CustomerOrderVendor>(
    `customer-order-vendor/${params.id}`
  );

  if (!data) notFound();

  return (
    <MainLayout title={data.customerOrder.orderCode}>
      <OrderDetails order={data} />
    </MainLayout>
  );
}
