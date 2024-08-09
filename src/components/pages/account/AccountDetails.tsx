"use client";

import { createAccount, updateAccount } from "@/actions/account.action";
import { VendorUser, VendorUserRole } from "@/prisma-types";
import { TAccountUpdateRequest } from "@/utils/models/account.model";
import { App, Form, FormProps, Input, Select, Flex, Button } from "antd";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

type Props = {
  roles: VendorUserRole[];
  account: VendorUser;
};

export default function AccountDetails({ account, roles }: Props) {
  const router = useRouter();
  const { notification } = App.useApp();
  const [isPending, startSubmission] = useTransition();
  const [form] = Form.useForm();

  const onFinish: FormProps<TAccountUpdateRequest>["onFinish"] = async (
    values
  ) => {
    startSubmission(async () => {
      const res = await updateAccount(account.vendorUserId, values);
      if (res.isSuccess) {
        notification.success({ message: res.message });
        form.resetFields();
        router.push(`/account?updated=${new Date().getTime()}`);
      } else {
        notification.error({ message: res.message });
      }
    });
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form<TAccountUpdateRequest>
      form={form}
      name='account'
      layout='vertical'
      onFinish={onFinish}
      initialValues={account}
      autoComplete='off'
      style={{ maxWidth: "480px" }}
    >
      <Form.Item<TAccountUpdateRequest>
        label='Name'
        name='name'
        rules={[{ required: true, message: "Please input name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<TAccountUpdateRequest>
        label='Email'
        name='email'
        rules={[
          { required: true, message: "Please input email address!" },
          { type: "email", message: "Please input valid email address!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<TAccountUpdateRequest>
        label='Role'
        name='vendorUserRoleId'
        rules={[{ required: true, message: "Please select role!" }]}
      >
        <Select>
          {roles.map((role) => (
            <Select.Option
              key={role.vendorUserRoleId}
              value={role.vendorUserRoleId}
            >
              {role.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Flex justify='end' gap={12}>
          <Button htmlType='button' onClick={onReset}>
            Reset
          </Button>
          <Button type='primary' htmlType='submit' loading={isPending}>
            Update
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
}
