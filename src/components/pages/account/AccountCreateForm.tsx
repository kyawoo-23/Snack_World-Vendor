"use client";

import { createAccount } from "@/actions/account.action";
import { VendorUserRole } from "@/prisma-types";
import { TAccountCreateRequest } from "@/utils/models/account.model";
import { App, Button, Flex, Form, FormProps, Input, Select } from "antd";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Props = {
  roles: VendorUserRole[];
};

export default function AccountCreateForm({ roles }: Props) {
  const router = useRouter();
  const { notification } = App.useApp();
  const [isPending, startSubmission] = useTransition();
  const [form] = Form.useForm();

  const onFinish: FormProps<TAccountCreateRequest>["onFinish"] = async (
    values
  ) => {
    const request = {
      ...values,
      vendorId: process.env.NEXT_PUBLIC_VENDOR_ID,
    };

    startSubmission(async () => {
      const res = await createAccount(request);
      if (res.isSuccess) {
        notification.success({ message: res.message });
        form.resetFields();
        router.push("/account");
      } else {
        notification.error({ message: res.message });
      }
    });
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form<TAccountCreateRequest>
      form={form}
      name='account'
      layout='vertical'
      onFinish={onFinish}
      autoComplete='off'
      style={{ maxWidth: "480px" }}
    >
      <Form.Item<TAccountCreateRequest>
        label='Name'
        name='name'
        rules={[{ required: true, message: "Please input name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<TAccountCreateRequest>
        label='Email'
        name='email'
        rules={[
          { required: true, message: "Please input email address!" },
          { type: "email", message: "Please input valid email address!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<TAccountCreateRequest>
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
            Submit
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
}
