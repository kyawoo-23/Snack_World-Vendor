"use client";

import Image from "next/image";
import { Product } from "@/prisma-types";
import { Table, TableColumnsType } from "antd";

export default function ProductList({ products }: { products: Product[] }) {
  console.log(products);
  const columns: TableColumnsType<Product> = [
    {
      title: "Image",
      dataIndex: "primaryImage",
      render: (image) => {
        return (
          <figure className='size-14'>
            <Image src={image} fill className='object-contain' alt='product' />
          </figure>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Stock",
      dataIndex: "stock",
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (category) => {
        return category.name;
      },
      sorter: (a, b) => a.category.name.length - b.category.name.length,
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Promotion",
      dataIndex: "promotion",
      render: (promotion, record) => {
        return promotion ? record.promotionPrice : "N/A";
      },
    },
  ];
  return <Table columns={columns} dataSource={products} />;
}
