export type TOrderAcceptRequest = {
  customerOrderId: string;
  customerOrderVendorId: string;
  type: "SELF" | "REQUEST";
  deliveryName: string;
};
