"use client";

import { CustomerOrderVendor } from "@/prisma-types";
import { Badge, Descriptions, DescriptionsProps } from "antd";

type Props = {
  order: CustomerOrderVendor;
};

export default function OrderDetails({ order }: Props) {
  console.log(order);

  const userItems: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Name",
      children: order.customer.name,
    },
    {
      key: "2",
      label: "Email",
      children: order.customer.email,
    },
    {
      key: "3",
      label: "Billing Mode",
      children: order.customerOrder.isPrepaid ? "PAID" : "COD",
    },
    {
      key: "4",
      label: "Contact Number",
      children: order.customerOrder.deliveryContact,
    },
    {
      key: "5",
      label: "Delivery Address",
      span: 2,
      children: order.customerOrder.deliveryAddress,
    },
  ];

  const orderItems: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Order Created At",
      children: new Date(order.customerOrder.createdAt).toLocaleString(),
    },
    {
      key: "2",
      label: "Order Updated At",
      children: new Date(order.customerOrder.updatedAt).toLocaleString(),
    },
    {
      key: "3",
      label: "Status",
      children: (
        <Badge status='processing' text={order.customerOrderVendorStatus} />
      ),
    },
    {
      key: "4",
      label: "Total Products",
      children: order.customerOrderVendorProduct.length,
    },
    {
      key: "5",
      label: "Total Amount ($)",
      children: order.customerOrder.totalPrice,
    },
  ];

  return (
    <div className='grid grid-cols-3 gap-4'>
      <Descriptions
        title='Customer Info'
        layout='vertical'
        bordered
        items={userItems}
      />

      <Descriptions
        className='col-span-2'
        title='Order Info'
        layout='vertical'
        bordered
        items={orderItems}
      />
    </div>
  );
}
