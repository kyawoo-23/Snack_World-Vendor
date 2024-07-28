import AccountCreateForm from "@/components/pages/account/AccountCreateForm";
import MainLayout from "@/components/Layout/MainLayout";
import { VendorUserRole } from "@/prisma-types";
import { axiosAPI } from "@/utils/api/config";
import { BaseResponse } from "@/utils/constants/response.type";

export default async function page() {
  const {
    data: { data: roles },
  } = await axiosAPI.get<BaseResponse<VendorUserRole[]>>("vendor-user-roles");

  return (
    <MainLayout title='Create new account'>
      <AccountCreateForm roles={roles} />
    </MainLayout>
  );
}
