import { CustomerOrderVendor } from "@/prisma-types";

export type TSalesReportResponse = {
  totalSales: number;
  totalProductsSold: number;
  totalOrders: number;
  rejectedOrders: number;
  selfDeliveryOrders: number;
  requestDeliveryOrders: number;
  orders: CustomerOrderVendor[];
};
