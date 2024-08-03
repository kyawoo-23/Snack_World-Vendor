// AUTO GENERATED FILE BY @kalissaac/prisma-typegen
// DO NOT EDIT




export type AnnouncementVendor = {
    announcementVendorId: string,
    vendorId: string,
    vendor: Vendor,
    announcementId: string,
    announcement: Announcement,
}

export type AnnouncementCustomer = {
    announcementCustomerId: string,
    customerId: string,
    customer: Customer,
    announcementId: string,
    announcement: Announcement,
}

export type Announcement = {
    announcementId: string,
    title: string,
    content: string,
    image: string,
    type: string,
    createdAt: Date,
    updatedAt: Date,
    announcementVendor: AnnouncementVendor[],
    announcementCustomer: AnnouncementCustomer[],
}

export type AdminRole = {
    adminRoleId: string,
    name: string,
    admin: Admin[],
}

export type Admin = {
    adminId: string,
    name: string,
    email: string,
    password: string,
    adminRoleId: string,
    isActive: boolean,
    adminRole: AdminRole,
    delivery: Delivery[],
    createdAt: Date,
    updatedAt: Date,
}

export type Variant = {
    variantId: string,
    name: string,
    color: string,
    productVariant: ProductVariant[],
    createdAt: Date,
    updatedAt: Date,
}

export type ProductVariant = {
    productVariantId: string,
    variantId: string,
    productId: string,
    stock: number,
    variant: Variant,
    product: Product,
    purchaseProduct: PurchaseProduct[],
    wishListProduct: WishListProduct[],
    cartProduct: CartProduct[],
    customerOrderVendorProduct: CustomerOrderVendorProduct[],
}

export type Delivery = {
    deliveryId: string,
    deliveryCode: string,
    deliveryStatus: string,
    deliveryName: string,
    createdAt: Date,
    updatedAt: Date,
    completeAt: Date,
    adminId: string,
    admin: Admin,
    deliveryOrder: DeliveryOrder[],
}

export type Category = {
    categoryId: string,
    name: string,
    product: Product[],
    createdAt: Date,
    updatedAt: Date,
}

export type ProductImage = {
    productImageId: string,
    image: string,
    productId: string,
    product: Product,
    createdAt: Date,
    updatedAt: Date,
}

export type VendorUser = {
    vendorUserId: string,
    name: string,
    email: string,
    password: string,
    vendorUserRoleId: string,
    vendorId: string,
    isActive: boolean,
    vendorUserRole: VendorUserRole,
    vendor: Vendor,
    vendorPurchase: VendorPurchase[],
    createdAt: Date,
    updatedAt: Date,
}

export type Vendor = {
    vendorId: string,
    name: string,
    image: string,
    email: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    product: Product[],
    customerOrderVendor: CustomerOrderVendor[],
    announcementVendor: AnnouncementVendor[],
    vendorUser: VendorUser[],
}

export type Customer = {
    customerId: string,
    name: string,
    email: string,
    password: string,
    image?: string,
    phone?: string,
    address?: string,
    announcementCustomer: AnnouncementCustomer[],
    wishListProduct: WishListProduct[],
    cartProduct: CartProduct[],
    customerOrder: CustomerOrder[],
    customerOrderVendor: CustomerOrderVendor[],
    createdAt: Date,
    updatedAt: Date,
}

export type PurchaseProduct = {
    purchaseProductId: string,
    purchasePrice: number,
    quantity: number,
    productVariantId: string,
    productId: string,
    productVariant: ProductVariant,
    product: Product,
    vendorPurchaseId: string,
    vendorPurchase: VendorPurchase,
    createdAt: Date,
    updatedAt: Date,
}

export type VendorUserRole = {
    vendorUserRoleId: string,
    name: string,
    vendorUser: VendorUser[],
}

export type WishListProduct = {
    wishListProductId: string,
    productId: string,
    productVariantId: string,
    customerId: string,
    product: Product,
    productVariant: ProductVariant,
    customer: Customer,
}

export type VendorPurchase = {
    vendorPurchaseId: string,
    purchaseCode: string,
    purchaseAt: Date,
    vendorUserId: string,
    vendorUser: VendorUser,
    purchaseProduct: PurchaseProduct[],
    createdAt: Date,
    updatedAt: Date,
}

export type CartProduct = {
    cartProductId: string,
    quantity: number,
    productId: string,
    productVariantId: string,
    customerId: string,
    product: Product,
    productVariant: ProductVariant,
    customer: Customer,
}

export type CustomerOrder = {
    customerOrderId: string,
    orderCode: string,
    orderStatus: string,
    totalPrice: number,
    deliveryPrice: number,
    deliveryAddress: string,
    deliveryMethod: string,
    customerId: string,
    createdAt: Date,
    updatedAt: Date,
    customer: Customer,
    customerOrderVendor: CustomerOrderVendor[],
}

export type DeliveryOrder = {
    deliveryOrderId: string,
    deliveryOrderStatus: string,
    deliveryName: string,
    startAt: Date,
    endAt: Date,
    deliveryId: string,
    customerOrderVendorId: string,
    delivery: Delivery,
    customerOrderVendor: CustomerOrderVendor,
}

export type CustomerOrderVendor = {
    customerOrderVendorId: string,
    vendorName: string,
    vendorId: string,
    customerOrderVendorStatus: string,
    deliveryAddress: string,
    customerOrderId: string,
    customerId: string,
    vendor: Vendor,
    customerOrder: CustomerOrder,
    customer: Customer,
    deliveryOrder: DeliveryOrder[],
    customerOrderVendorProduct: CustomerOrderVendorProduct[],
}

export type CustomerOrderVendorProduct = {
    customerOrderVendorProductId: string,
    productName: string,
    variantName: string,
    vendorName: string,
    quantity: number,
    price: number,
    orderVendorProductStatus: string,
    productId: string,
    productVariantId: string,
    customerOrderVendorId: string,
    product: Product,
    productVariant: ProductVariant,
    customerOrderVendor: CustomerOrderVendor,
}

export type Product = {
    productId: string,
    name: string,
    description: string,
    primaryImage: string,
    weight: number,
    price: number,
    promotion: boolean,
    promotionPrice?: number,
    isActive: boolean,
    vendorId: string,
    categoryId: string,
    vendor: Vendor,
    category: Category,
    productImage: ProductImage[],
    productVariant: ProductVariant[],
    purchaseProduct: PurchaseProduct[],
    wishListProduct: WishListProduct[],
    cartProduct: CartProduct[],
    customerOrderVendorProduct: CustomerOrderVendorProduct[],
    createdAt: Date,
    updatedAt: Date,
}
