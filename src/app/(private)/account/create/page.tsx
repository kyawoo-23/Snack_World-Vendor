import AccountCreateForm from "@/components/pages/account/AccountCreateForm";
import MainLayout from "@/components/Layout/MainLayout";
import { VendorUserRole } from "@/prisma-types";
import { get } from "@/utils/api";

export default async function page() {
  const { data: roles } = await get<VendorUserRole[]>("vendor-user-roles");

  return (
    <MainLayout title='Create new account'>
      <AccountCreateForm roles={roles ?? []} />
    </MainLayout>
  );
}
