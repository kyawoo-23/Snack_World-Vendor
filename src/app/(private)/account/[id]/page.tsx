import { VendorUser } from "@/prisma-types";
import { get } from "@/utils/api";
import { notFound } from "next/navigation";

export default async function page({ params }: { params: { id: string } }) {
  const { data } = await get<VendorUser>(`vendor-user/${params.id}`);

  if (!data) notFound();

  console.log(data);
  return <div>page</div>;
}
