"use server";

import { get } from "@/utils/api";
import { TSalesReportResponse } from "@/utils/models/report.model";
import { revalidatePath } from "next/cache";

export async function getSalesReport(
  startDate: Date,
  endDate: Date
): Promise<TSalesReportResponse> {
  const res = await get<TSalesReportResponse>(
    `customer-order-vendor/sales-report?startDate=${startDate}&endDate=${endDate}`
  );

  // revalidatePath("/sales-report");
  return res.data;
}
