"use client";

import {
  resetAccountPassword,
  toggleAccountStatus,
} from "@/actions/account.action";
import { VendorUser } from "@/prisma-types";
import { App, Button, Popconfirm, Switch, Table, TableColumnsType } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { MdModeEditOutline, MdOutlineLockReset } from "react-icons/md";

export default function AccountList({ data }: { data: VendorUser[] }) {
  const { message } = App.useApp();
  const [isToggling, startToggling] = useTransition();
  const [isResetting, startResetting] = useTransition();
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
        <Popconfirm
          title='Confirmation'
          description='Account status will be changed! Are you sure?'
          onConfirm={() =>
            startToggling(() => toggleStatus(record.vendorUserId))
          }
        >
          <Switch
            checkedChildren='Active'
            unCheckedChildren='InActive'
            checked={isActive}
            loading={isToggling}
          />
        </Popconfirm>
      ),
    },
    {
      title: "Action",
      render: (record) => (
        <div className='flex items-center gap-2'>
          <Popconfirm
            title='Reset password'
            description='Password will be reset! Are you sure?'
            onConfirm={() =>
              startResetting(() => resetPassword(record.vendorUserId))
            }
          >
            <Button
              shape='round'
              icon={<MdOutlineLockReset />}
              loading={isResetting}
            />
          </Popconfirm>
          <Link href={`account/${record.vendorUserId}`}>
            <Button shape='round' icon={<MdModeEditOutline />} />
          </Link>
        </div>
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

  const resetPassword = async (id: string) => {
    const res = await resetAccountPassword(id);
    if (res.isSuccess) {
      message.success(res.message);
      router.refresh();
    } else {
      message.error(res.message);
    }
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => record.vendorUserId}
    />
  );
}
