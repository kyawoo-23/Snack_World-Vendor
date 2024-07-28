"use client";

import { toggleAccountStatus } from "@/actions/account.action";
import { VendorUser } from "@/prisma-types";
import { App, Switch, Table, TableColumnsType } from "antd";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function AccountList({ data }: { data: VendorUser[] }) {
  const { message } = App.useApp();
  const [isPending, startSubmission] = useTransition();
  const router = useRouter();

  const columns: TableColumnsType<VendorUser> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "vendorUserRole",
      render: (role) => role.name,
      sorter: (a, b) =>
        a.vendorUserRole.name.length - b.vendorUserRole.name.length,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive, record) => (
        <Switch
          checkedChildren='Active'
          unCheckedChildren='InActive'
          checked={isActive}
          onChange={() =>
            startSubmission(() => toggleStatus(record.vendorUserId))
          }
          loading={isPending}
        />
      ),
    },
  ];

  const toggleStatus = async (id: string) => {
    const res = await toggleAccountStatus(id);
    if (res.isSuccess) {
      message.success(res.message);
      router.refresh();
    } else {
      message.error(res.message);
    }
  };

  return <Table columns={columns} dataSource={data} />;
}
