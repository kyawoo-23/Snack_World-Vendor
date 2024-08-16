export type TVendorPurchaseRequest = {
  vendorUserId: string;
  purchaseProducts: {
    purchasePrice: number;
    quantity: number;
    productVariantId: string;
    productId: string;
  }[];
};
