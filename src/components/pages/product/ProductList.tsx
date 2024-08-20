"use client";

import Image from "next/image";
import { Product } from "@/prisma-types";
import { Table, TableColumnsType, Button, Popconfirm, Switch, App } from "antd";
import { MdModeEditOutline } from "react-icons/md";
import Link from "next/link";
import { calculateTotalStock } from "@/utils/shared";
import { useTransition } from "react";
import { toggleProductStatus } from "@/actions/product.action";
import { useRouter } from "next/navigation";

export default function ProductList({ products }: { products: Product[] }) {
  const [isToggling, startToggling] = useTransition();
  const { message } = App.useApp();
  const router = useRouter();

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
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Total Stock",
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
      render: (isActive, record) => (
        <Popconfirm
          title='Confirmation'
          description='Product status will be changed! Are you sure?'
          onConfirm={() => startToggling(() => toggleStatus(record.productId))}
        >
          <Switch
            checkedChildren='Active'
            unCheckedChildren='InActive'
            checked={isActive}
            loading={isToggling}
          />
        </Popconfirm>
      ),
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

  const toggleStatus = async (id: string) => {
    const res = await toggleProductStatus(id);
    if (res.isSuccess) {
      message.success(res.message);
      router.refresh();
    } else {
      message.error(res.message);
    }
  };

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey={(record) => record.productId}
    />
  );
}
