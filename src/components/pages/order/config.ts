import {
  CUSTOMER_ORDER_VENDOR_STATUS,
  DELIVERY_ORDER_STATUS,
} from "@/utils/constants";

export const getVendorOrderStatus = (status: string) => {
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

export const getDeliveryStatus = (status: string) => {
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
