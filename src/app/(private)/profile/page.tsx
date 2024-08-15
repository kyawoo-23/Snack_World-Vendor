import MainLayout from "@/components/Layout/MainLayout";
import ProfileDetails from "@/components/pages/profile/ProfileDetails";
import { VendorUser, VendorUserRole } from "@/prisma-types";
import { get } from "@/utils/api";

export default async function page() {
  const { data: account } = await get<VendorUser>("vendor-user/profile");
  const { data: roles } = await get<VendorUserRole[]>("vendor-user-roles");

  return (
    <MainLayout title='Profile'>
      <ProfileDetails account={account} roles={roles} />
    </MainLayout>
  );
}
