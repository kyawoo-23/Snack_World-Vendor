"use client";

import {
  CustomerOrderVendor,
  CustomerOrderVendorProduct,
} from "@/prisma-types";
import {
  Badge,
  Descriptions,
  DescriptionsProps,
  TableColumnsType,
  Table,
} from "antd";
import OrderDetailsAction from "@/components/pages/order/OrderDetailsAction";
import {
  CUSTOMER_ORDER_VENDOR_STATUS,
  DELIVERY_ORDER_STATUS,
} from "@/utils/constants";

type Props = {
  order: CustomerOrderVendor;
};

const getVendorOrderStatus = (status: string) => {
  switch (status) {
    case CUSTOMER_ORDER_VENDOR_STATUS.NEW:
      return "geekblue";
    case CUSTOMER_ORDER_VENDOR_STATUS.ACCEPTED:
      return "purple";
    case CUSTOMER_ORDER_VENDOR_STATUS.COMPLETED:
      return "green";
    case CUSTOMER_ORDER_VENDOR_STATUS.CANCELLED:
      return "red";
    case CUSTOMER_ORDER_VENDOR_STATUS.DELIVERING:
      return "orange";
    case CUSTOMER_ORDER_VENDOR_STATUS.DELIVERED:
      return "lime";
    default:
      return "default";
  }
};

const getDeliveryStatus = (status: string) => {
  switch (status) {
    case DELIVERY_ORDER_STATUS.NEW:
      return "geekblue";
    case DELIVERY_ORDER_STATUS.DELIVERING:
      return "orange";
    case DELIVERY_ORDER_STATUS.DELIVERED:
      return "green";
    default:
      return "default";
  }
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
        <Badge
          status={
            order.customerOrderVendorStatus ===
            CUSTOMER_ORDER_VENDOR_STATUS.COMPLETED
              ? "success"
              : "processing"
          }
          color={getVendorOrderStatus(order.customerOrderVendorStatus)}
          text={order.customerOrderVendorStatus}
        />
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
    {
      key: "6",
      label:
        order.customerOrderVendorStatus !== CUSTOMER_ORDER_VENDOR_STATUS.NEW
          ? "Delivery Status"
          : "",
      children: order.customerOrderVendorStatus !==
        CUSTOMER_ORDER_VENDOR_STATUS.NEW && (
        <Badge
          status={
            order.deliveryOrder[0].deliveryOrderStatus ===
            DELIVERY_ORDER_STATUS.DELIVERED
              ? "success"
              : "processing"
          }
          color={getDeliveryStatus(order.deliveryOrder[0].deliveryOrderStatus)}
          text={order.deliveryOrder[0].deliveryOrderStatus}
        />
      ),
    },
  ];

  const columns: TableColumnsType<CustomerOrderVendorProduct> = [
    {
      title: "Name",
      dataIndex: "productName",
    },
    {
      title: "Variant",
      dataIndex: "variantName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Unit Price ($)",
      dataIndex: "price",
    },
    {
      title: "Total Price ($)",
      render: (record) => record.price * record.quantity,
    },
  ];

  return (
    <>
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

        <div className='flex justify-end col-span-3 mb-4 mt-2'>
          <OrderDetailsAction order={order} />
        </div>

        <div className='col-span-3'>
          <h3 className='text-[16px] font-medium mb-4'>Product List</h3>
          <Table
            columns={columns}
            dataSource={order.customerOrderVendorProduct}
            rowKey={(record) => record.customerOrderVendorProductId}
          />
        </div>
      </div>
    </>
  );
}
