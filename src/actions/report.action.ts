"use server";

import { CustomerOrderVendorProduct } from "@/prisma-types";
import { get } from "@/utils/api";
import { TSalesReportResponse } from "@/utils/models/report.model";

export async function getSalesReport(
  startDate: Date,
  endDate: Date
): Promise<TSalesReportResponse> {
  const { data } = await get<TSalesReportResponse>(
    `customer-order-vendor/sales-report?startDate=${startDate}&endDate=${endDate}`
  );

  return data;
}

export async function getProductReport(
  startDate: Date,
  endDate: Date
): Promise<CustomerOrderVendorProduct[]> {
  const { data } = await get<CustomerOrderVendorProduct[]>(
    `customer-order-vendor/product-report?startDate=${startDate}&endDate=${endDate}`
  );

  return data;
}
