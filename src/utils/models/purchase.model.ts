export type TVendorPurchaseRequest = {
  purchaseCode: string;
  purchaseProducts: {
    purchasePrice: number;
    quantity: number;
    productVariantId: string;
    productId: string;
  }[];
};
