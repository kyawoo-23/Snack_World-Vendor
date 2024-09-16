"use client";

import { Product, ProductVariant } from "@/prisma-types";
import { Table, TableColumnsType, Alert } from "antd";
import Image from "next/image";
import { calculateTotalStock } from "@/utils/shared";

type Props = {
  product: Product;
};

const isLowStock = (stock: number) => stock < 10;

export default function ProductStockList({ product }: Props) {
  const columns: TableColumnsType<ProductVariant> = [
    {
      title: "Name",
      dataIndex: "variant",
      render: (variant) => variant.name,
      sorter: (a, b) => a.variant.name.length - b.variant.name.length,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      render: (stock) => {
        return isLowStock(stock) ? (
          <Alert
            message={stock === 0 ? "0" : stock}
            type='warning'
            showIcon
            className='w-fit'
          />
        ) : (
          stock
        );
      },
      sorter: (a, b) => a.stock - b.stock,
    },
  ];

  return (
    <div className='mb-6'>
      <div className='flex justify-between mb-2'>
        <div className='flex items-center gap-2'>
          <Image
            src={product.primaryImage}
            width={50}
            height={50}
            className='size-12 rounded-md object-cover'
            alt={product.name}
          />
          <h2 className='font-medium capitalize text-lg'>{product.name}</h2>
        </div>
        {isLowStock(calculateTotalStock(product.productVariant)) && (
          <Alert message='Low in stock' type='error' showIcon />
        )}
      </div>
      <Table
        columns={columns}
        dataSource={product.productVariant}
        rowKey={(record) => record.productVariantId}
        pagination={false}
      />
    </div>
  );
}
