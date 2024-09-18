"use client";

import type { TableColumnsType } from "antd";
import { Col, DatePicker, Row, Statistic, Tag, Button, Table } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { rangePresets } from "@/utils/shared";
import { usePDF } from "react-to-pdf";
import { useEffect, useState, useTransition } from "react";
import { getProductReport } from "@/actions/report.action";
import { CustomerOrderVendorProduct } from "@/prisma-types";

const { RangePicker } = DatePicker;

export default function ProductReport() {
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(dayjs().add(-7, "d").format())
  );
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(dayjs().format())
  );
  const [data, setData] = useState<CustomerOrderVendorProduct[] | []>([]);
  const [isPending, startFetch] = useTransition();

  const defaultRange: [Dayjs, Dayjs] = [dayjs(startDate), dayjs(endDate)];
  const { toPDF, targetRef } = usePDF({
    filename: `Product-report (${dayjs(startDate).format("MMM D, YYYY")} - ${dayjs(endDate).format("MMM D, YYYY")}).pdf`,
  });

  useEffect(() => {
    const fetchData = () => {
      startFetch(async () => {
        const res = await getProductReport(startDate!, endDate!);
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
      title: "Unit Price (Average)",
      dataIndex: "price",
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

      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.customerOrderVendorProductId}
        loading={isPending}
        pagination={false}
      />
    </div>
  );
}
