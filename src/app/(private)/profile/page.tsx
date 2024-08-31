import MainLayout from "@/components/Layout/MainLayout";
import ProfileDetails from "@/components/pages/profile/ProfileDetails";
import VendorDetails from "@/components/pages/profile/VendorDetails";
import { VendorUser, VendorUserRole } from "@/prisma-types";
import { get } from "@/utils/api";
import { Divider } from "antd";

export default async function page() {
  const { data: account } = await get<VendorUser>("vendor-user/profile");
  const { data: roles } = await get<VendorUserRole[]>("vendor-user-roles");

  return (
    <div className='grid grid-cols-2 gap-4'>
      <MainLayout title='Vendor'>
        <VendorDetails vendor={account.vendor} />
      </MainLayout>

      <MainLayout title='Profile'>
        <ProfileDetails account={account} roles={roles} />
      </MainLayout>
    </div>
  );
}
