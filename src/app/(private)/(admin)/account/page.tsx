import MainLayout from "@/components/Layout/MainLayout";
import AccountList from "@/components/pages/account/AccountList";
import { VendorUser } from "@/prisma-types";
import { get } from "@/utils/api";

import React from "react";

export default async function page() {
  const { data: users } = await get<VendorUser[]>("vendor-user");

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
