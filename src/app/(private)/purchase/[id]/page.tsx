import MainLayout from "@/components/Layout/MainLayout";
import { notFound } from "next/navigation";
import { VendorPurchase } from "@/prisma-types";
import { get } from "@/utils/api";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import PurchaseDetails from "@/components/pages/purchase/PurchaseDetails";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

export default async function page({ params }: { params: { id: string } }) {
  const { data: purchase } = await get<VendorPurchase>(
    `/vendor-purchase/${params.id}`
  );

  if (!purchase) notFound();

  return (
    <MainLayout title={`${purchase.purchaseCode}`}>
      <>
        <div className='flex justify-end gap-4 mb-4'>
          <h2 className='font-medium flex gap-2'>
            <UserOutlined />
            {purchase.vendorUser.name}
          </h2>
          |
          <h2 className='font-medium flex gap-2'>
            <CalendarOutlined />
            {new Date(purchase.purchaseAt).toLocaleString()}
          </h2>
          |
          <h2 className='font-medium flex gap-2 items-center'>
            <RiMoneyDollarCircleLine className='size-4' />
            {purchase.purchaseProduct.reduce(
              (acc, item) => acc + item.purchasePrice * item.quantity,
              0
            )}
          </h2>
        </div>
        <PurchaseDetails {...purchase} />
      </>
    </MainLayout>
  );
}
