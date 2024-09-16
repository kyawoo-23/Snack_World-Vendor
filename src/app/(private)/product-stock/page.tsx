import MainLayout from "@/components/Layout/MainLayout";
import ProductStockList from "@/components/pages/product/ProductStockList";
import { Product } from "@/prisma-types";
import { get } from "@/utils/api";

export default async function page() {
  const { data: products } = await get<Product[]>("product");

  console.log(products);

  return (
    <MainLayout title='Product Stocks'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {products.map((product) => (
          <ProductStockList product={product} key={product.productId} />
        ))}
      </div>
    </MainLayout>
  );
}
