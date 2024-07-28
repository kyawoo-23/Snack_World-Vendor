"use client";

import { VendorUserRole } from "@/prisma-types";
import { Button, Flex, Form, FormProps, Input, Select, Space } from "antd";

type Props = {
  roles: VendorUserRole[];
};

type FieldType = {
  name: string;
  email: string;
  vendorUserRoleId: string;
};

// 1486e0a9-3629-48d6-a597-bdfd6d31b783

export default function AccountCreateForm({ roles }: Props) {
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
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
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
}
