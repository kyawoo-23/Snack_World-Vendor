"use client";

import Image from "next/image";
import { PurchaseProduct, VendorPurchase } from "@/prisma-types";
import { TableColumnsType, Table, Tag } from "antd";

export default function PurchaseDetails({ purchaseProduct }: VendorPurchase) {
  console.log(purchaseProduct);
  const columns: TableColumnsType<PurchaseProduct> = [
    {
      title: "Image",
      dataIndex: "product",
      render: (product) => {
        return (
          <figure className='size-14'>
            <Image
              src={product.primaryImage}
              fill
              className='p-2 object-contain'
              alt='product'
            />
          </figure>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "product",
      render: (product) => {
        return product.name;
      },
    },
    {
      title: "Variant",
      dataIndex: "productVariant",
      render: (variant) => {
        return <Tag color={variant.variant.color}>{variant.variant.name}</Tag>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Price",
      dataIndex: "purchasePrice",
    },
    {
      title: "Total",
      dataIndex: "purchasePrice",
      render: (price, record) => {
        return price * record.quantity;
      },
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={purchaseProduct}
      rowKey={(record) => record.purchaseProductId}
    />
  );
}
