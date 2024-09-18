"use client";

import { getSalesReport } from "@/actions/report.action";
import { TSalesReportResponse } from "@/utils/models/report.model";
import type { TimeRangePickerProps } from "antd";
import { Col, DatePicker, Row, Statistic } from "antd";
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
import "./SalesReport.css";

const { RangePicker } = DatePicker;

const rangePresets: TimeRangePickerProps["presets"] = [
  { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
];

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

  return (
    <>
      <div className='mb-4 flex justify-end'>
        <RangePicker
          defaultValue={defaultRange}
          presets={rangePresets}
          onChange={onRangeChange}
          disabled={isPending}
        />
      </div>
      <div>
        <div>
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
        </div>
      </div>
    </>
  );
}
