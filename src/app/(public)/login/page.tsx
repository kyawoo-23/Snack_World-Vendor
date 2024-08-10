"use client";

import { login } from "@/actions/login.action";
import { COOKIE } from "@/utils/constants/cookie.type";
import { LOCAL_STORAGE } from "@/utils/constants/local-storage.type";
import { TLoginRequest } from "@/utils/models/login.model";
import { setLocalStorage } from "@/utils/shared/local-storage";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Input, Button, App } from "antd";
import { setCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { notification } = App.useApp();
  const [isPending, startSubmission] = useTransition();
  const [form] = Form.useForm();

  const onFinish = async (values: TLoginRequest) => {
    startSubmission(async () => {
      const res = await login(values);
      if (res.isSuccess) {
        notification.success({ message: res.message });
        form.resetFields();

        setCookie(COOKIE.TOKEN, res.data.accessToken);
        const user = {
          email: res.data.email,
          id: res.data.sub,
          role: res.data.role,
        };
        setLocalStorage(LOCAL_STORAGE.USER, JSON.stringify(user));

        router.push("/account");
      } else {
        console.log(res.message);
        notification.error({ message: res.message });
      }
    });
  };

  return (
    <div className='relative bg-gray-500 h-screen w-full'>
      <div className='w-[420px] h-[420px] absolute bg-[#1677FF] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-2xl'></div>
      <div className='w-[420px] h-[420px] absolute bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl p-8'>
        <Image
          className='mx-auto'
          src='/assets/logo/SNACK_WORLD.png'
          width={100}
          height={100}
          alt='logo'
        />
        <h1 className='text-2xl font-bold mb-8'>Login to vendor dashboard</h1>
        <Form<TLoginRequest> name='login' onFinish={onFinish} form={form}>
          <Form.Item<TLoginRequest>
            name='email'
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input type='email' prefix={<UserOutlined />} placeholder='Email' />
          </Form.Item>
          <Form.Item<TLoginRequest>
            name='password'
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type='password'
              placeholder='Password'
            />
          </Form.Item>

          <Form.Item>
            <Button block type='primary' htmlType='submit' loading={isPending}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
