"use client";

import Image from "next/image";
import { Product } from "@/prisma-types";
import { Table, TableColumnsType, Button, Tag } from "antd";
import { MdModeEditOutline } from "react-icons/md";
import Link from "next/link";
import { calculateTotalStock } from "@/utils/shared";

export default function ProductList({ products }: { products: Product[] }) {
  const columns: TableColumnsType<Product> = [
    {
      title: "Image",
      dataIndex: "primaryImage",
      render: (image) => {
        return (
          <figure className='size-14'>
            <Image
              src={image}
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
      dataIndex: "n",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Stock",
      dataIndex: "productVariant",
      render: (variant) => {
        return calculateTotalStock(variant);
      },
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
      title: "Status",
      dataIndex: "isActive",
      render: (active) => {
        return active ? (
          <Tag color='green'>Active</Tag>
        ) : (
          <Tag color='red'>In Active</Tag>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "productId",
      render: (id) => {
        return (
          <Link href={`product/${id}`}>
            <Button icon={<MdModeEditOutline />} shape='round'></Button>
          </Link>
        );
      },
    },
  ];
  return <Table columns={columns} dataSource={products} />;
}
