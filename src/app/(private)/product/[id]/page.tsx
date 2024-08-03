import { Product } from "@/prisma-types";
import { get } from "@/utils/api";

export default async function page({ params }: { params: { id: string } }) {
  const { data: product } = await get<Product>(`/product/${params.id}`);

  if (!product) return "No product found";
  console.log(product);

  return <div>{params.id}</div>;
}
