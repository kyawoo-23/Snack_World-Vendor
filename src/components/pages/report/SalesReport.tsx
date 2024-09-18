"use client";

import Link from "next/link";
import { getSalesReport } from "@/actions/report.action";
import { TSalesReportResponse } from "@/utils/models/report.model";
import type { TableColumnsType } from "antd";
import { Col, DatePicker, Row, Statistic, Tag, Button, Table } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useEffect, useState, useTransition } from "react";
import { BsBoxFill } from "react-icons/bs";
import {
  FaFileCircleMinus,
  FaFileInvoice,
  FaFileInvoiceDollar,
  FaTruck,
} from "react-icons/fa6";
import { MdDeliveryDining } from "react-icons/md";
import { CustomerOrderVendor } from "@/prisma-types";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { getVendorOrderStatus } from "@/components/pages/order/config";
import { usePDF } from "react-to-pdf";
import { rangePresets } from "@/utils/shared";
import "./SalesReport.css";

const { RangePicker } = DatePicker;

export default function SalesReport() {
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(dayjs().add(-7, "d").format())
  );
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(dayjs().format())
  );
  const [data, setData] = useState<TSalesReportResponse | null>(null);
  const [isPending, startFetch] = useTransition();

  const defaultRange: [Dayjs, Dayjs] = [dayjs(startDate), dayjs(endDate)];
  const { toPDF, targetRef } = usePDF({
    filename: `Sales-report (${dayjs(startDate).format("MMM D, YYYY")} - ${dayjs(endDate).format("MMM D, YYYY")}).pdf`,
  });

  useEffect(() => {
    const fetchData = () => {
      startFetch(async () => {
        const res = await getSalesReport(startDate!, endDate!);
        setData(res);
        console.log(res);
      });
    };

    fetchData();
  }, [startDate, endDate]);

  const onRangeChange = async (
    dates: null | (Dayjs | null)[],
    dateStrings: string[]
  ) => {
    if (dates) {
      setStartDate(new Date(dateStrings[0]));
      setEndDate(new Date(dateStrings[1]));
    }
  };

  const columns: TableColumnsType<CustomerOrderVendor> = [
    {
      title: "Order Date",
      dataIndex: "customerOrder",
      render: (order) => dayjs(order.createdAt).format("MMM D, YYYY h:mm A"),
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
      title: "Total Amount",
      dataIndex: "customerOrder",
      render: (order) => order.totalPrice,
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
    <div ref={targetRef}>
      <div className='mb-4 flex justify-end items-center gap-4'>
        <RangePicker
          defaultValue={defaultRange}
          presets={rangePresets}
          onChange={onRangeChange}
          disabled={isPending}
        />
        <Button type='primary' onClick={() => toPDF()} disabled={isPending}>
          Download PDF
        </Button>
      </div>

      <Row gutter={16} justify='end'>
        <Col span={4}>
          <Statistic
            title='Total Sales'
            value={data?.totalSales}
            prefix={<FaFileInvoiceDollar />}
            loading={isPending}
            className='!px-4 !py-2 rounded-lg bg-[#6DECB9]'
          />
        </Col>
        <Col span={4}>
          <Statistic
            title='Total Orders'
            value={data?.totalOrders}
            prefix={<FaFileInvoice />}
            loading={isPending}
            className='!px-4 !py-2 rounded-lg bg-[#EEF5B2]'
          />
        </Col>
        <Col span={4}>
          <Statistic
            title='Rejected Orders'
            value={data?.rejectedOrders}
            prefix={<FaFileCircleMinus />}
            loading={isPending}
            className='!px-4 !py-2 rounded-lg bg-[#C6CBEF]'
          />
        </Col>
        <Col span={4}>
          <Statistic
            title='Products Sold'
            value={data?.totalProductsSold}
            prefix={<BsBoxFill />}
            loading={isPending}
            className='!px-4 !py-2 rounded-lg bg-[#E3E7F1]'
          />
        </Col>
      </Row>
      <Row gutter={16} justify='end' className='mt-4'>
        <Col span={4}>
          <Statistic
            title='Self Delivery Orders'
            value={data?.selfDeliveryOrders}
            prefix={<MdDeliveryDining />}
            loading={isPending}
            className='!px-4 !py-2 rounded-lg bg-[#C6CFFF]'
          />
        </Col>
        <Col span={4}>
          <Statistic
            title='Snack World Delivery Orders'
            value={data?.requestDeliveryOrders}
            prefix={<FaTruck />}
            loading={isPending}
            className='!px-4 !py-2 rounded-lg bg-[#E8D3FF]'
          />
        </Col>
      </Row>

      <div className='mt-4'>
        <Table
          columns={columns}
          dataSource={data?.orders}
          rowKey={(record) => record.customerOrderVendorId}
          loading={isPending}
          pagination={false}
        />
      </div>
    </div>
  );
}
