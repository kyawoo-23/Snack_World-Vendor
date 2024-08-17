"use client";

import { PurchaseProduct, VendorPurchase } from "@/prisma-types";
import { Button, Table, TableColumnsType } from "antd";
import Link from "next/link";
import { MdOutlineMoreHoriz } from "react-icons/md";

export default function PurchaseList({
  purchases,
}: {
  purchases: VendorPurchase[];
}) {
  const columns: TableColumnsType<VendorPurchase> = [
    {
      title: "Purchased At",
      dataIndex: "purchaseAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Purchase Code",
      dataIndex: "purchaseCode",
    },
    {
      title: "Purchased By",
      dataIndex: "vendorUser",
      render: (user) => user.name,
    },
    {
      title: "Total Amount ($)",
      dataIndex: "purchaseProduct",
      render: (products) => {
        return products.reduce(
          (acc: number, curr: PurchaseProduct) =>
            acc + curr.quantity * curr.purchasePrice,
          0
        );
      },
    },
    {
      title: "Action",
      render: (record) => (
        <div className='flex items-center gap-2'>
          <Link href={`purchase/${record.vendorPurchaseId}`}>
            <Button shape='round' icon={<MdOutlineMoreHoriz />} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={purchases}
      rowKey={(record) => record.vendorPurchaseId}
    />
  );
}
