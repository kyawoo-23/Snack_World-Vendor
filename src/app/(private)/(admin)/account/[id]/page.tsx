import MainLayout from "@/components/Layout/MainLayout";
import AccountDetails from "@/components/pages/account/AccountDetails";
import { VendorUser, VendorUserRole } from "@/prisma-types";
import { get } from "@/utils/api";
import { notFound } from "next/navigation";

export default async function page({ params }: { params: { id: string } }) {
  const { data: roles } = await get<VendorUserRole[]>("vendor-user-roles");
  const { data: account } = await get<VendorUser>(`vendor-user/${params.id}`);

  if (!account) notFound();

  return (
    <MainLayout title='Edit account'>
      <AccountDetails roles={roles ?? []} account={account} />
    </MainLayout>
  );
}
