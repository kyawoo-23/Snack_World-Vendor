"use client";

import { COOKIE } from "@/utils/constants/cookie.type";
import { LOCAL_STORAGE } from "@/utils/constants/local-storage.type";
import {
  getLocalStorage,
  removeLocalStorage,
} from "@/utils/shared/local-storage";
import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { App, Dropdown, MenuProps } from "antd";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const { notification } = App.useApp();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    id: string;
    role: string;
  }>(() => {
    try {
      const storedUser = getLocalStorage(LOCAL_STORAGE.USER);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    removeLocalStorage(LOCAL_STORAGE.USER);
    deleteCookie(COOKIE.TOKEN);
    notification.success({ message: "Logout successfully" });
    router.push("/login");
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <button onClick={handleLogout}>
          <div className='flex items-center gap-3 justify-between'>
            <LogoutOutlined />
            Logout
          </div>
        </button>
      ),
    },
  ];

  return (
    <div className='h-14 w-full bg-white flex items-center'>
      <div className='max-w-[1440px] w-full px-6 mx-auto'>
        <Dropdown.Button
          type='text'
          icon={<DownOutlined />}
          menu={{ items }}
          className='flex justify-end'
        >
          <Link href='/profile'>
            <div className='flex items-center gap-3'>
              <UserOutlined />
              {user?.name}
            </div>
          </Link>
        </Dropdown.Button>
      </div>
    </div>
  );
}
