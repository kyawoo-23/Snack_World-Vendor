"use client";

import { createAccount } from "@/actions/account.action";
import { VendorUserRole } from "@/prisma-types";
import { App, Button, Flex, Form, FormProps, Input, Select } from "antd";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Props = {
  roles: VendorUserRole[];
};

type FieldType = {
  name: string;
  email: string;
  vendorUserRoleId: string;
};

export default function AccountCreateForm({ roles }: Props) {
  const router = useRouter();
  const { notification } = App.useApp();
  const [isPending, startSubmission] = useTransition();
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const request = {
      ...values,
      vendorId: "4725b046-de62-47fb-9093-269b73c43df2",
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
    <Form<FieldType>
      form={form}
      name='account'
      layout='vertical'
      onFinish={onFinish}
      autoComplete='off'
      style={{ maxWidth: "480px" }}
    >
      <Form.Item<FieldType>
        label='Name'
        name='name'
        rules={[{ required: true, message: "Please input name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label='Email'
        name='email'
        rules={[
          { required: true, message: "Please input email address!" },
          { type: "email", message: "Please input valid email address!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
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
