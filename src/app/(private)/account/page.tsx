import MainLayout from "@/components/Layout/MainLayout";
import AccountList from "@/components/pages/account/AccountList";
import { VendorUser } from "@/prisma-types";
import { axiosAPI } from "@/utils/api/config";
import { BaseResponse } from "@/utils/constants/response.type";

import React from "react";

export default async function page() {
  const {
    data: { data: users },
  } = await axiosAPI.get<BaseResponse<VendorUser[]>>("/vendor-user");

  return (
    <MainLayout
      title='Account'
      action={{
        label: "Create Account",
        href: "/account/create",
      }}
    >
      <AccountList data={users ?? []} />
    </MainLayout>
  );
}
