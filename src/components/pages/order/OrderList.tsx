"use client";

import Link from "next/link";
import { CustomerOrderVendor } from "@/prisma-types";
import { Table, TableColumnsType, Button, Tag } from "antd";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { getVendorOrderStatus } from "@/components/pages/order/config";

type Props = {
  orders: CustomerOrderVendor[];
};

export default function OrderList({ orders }: Props) {
  console.log(orders);

  const columns: TableColumnsType<CustomerOrderVendor> = [
    {
      title: "Order Date",
      dataIndex: "customerOrder",
      render: (order) => new Date(order.createdAt).toLocaleString(),
    },
    {
      title: "Order Code",
      dataIndex: "customerOrder",
      render: (order) => order.orderCode,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      render: (customer) => customer.name,
    },
    {
      title: "Delivery Details",
      dataIndex: "customerOrder",
      render: (order) => (
        <div>
          <p>{order.deliveryAddress}</p>
          <p>{order.deliveryContact}</p>
        </div>
      ),
    },
    {
      title: "Status",
      render: (record) => {
        return (
          <Tag color={getVendorOrderStatus(record.customerOrderVendorStatus)}>
            {record.customerOrderVendorStatus}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      render: (record) => (
        <div className='flex items-center gap-2'>
          <Link href={`/order/${record.customerOrderVendorId}`}>
            <Button shape='round' icon={<MdOutlineMoreHoriz />} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
      rowKey={(record) => record.customerOrderVendorId}
    />
  );
}
