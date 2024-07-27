"use client";

import { useState } from "react";
import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { getLocalStorage, setLocalStorage } from "@/utils/shared/local-storage";
import { LOCAL_STORAGE } from "@/utils/constants/local-storage.type";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  link?: string,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label: link ? <Link href={link}>{label}</Link> : label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Option 1", "1", "/", <PieChartOutlined />),
  getItem("Option 2", "2", "/", <DesktopOutlined />),
  getItem("User", "sub1", "/", <UserOutlined />, [
    getItem("Tom", "3", "/"),
    getItem("Bill", "4", ""),
    getItem("Alex", "5", ""),
  ]),
  getItem("Team", "sub2", "/", <TeamOutlined />, [
    getItem("Team 1", "6", "/"),
    getItem("Team 2", "8", "/"),
  ]),
  getItem("Files", "9", "/", <FileOutlined />),
];

export default function SideBar() {
  const [collapsed, setCollapsed] = useState(
    getLocalStorage(LOCAL_STORAGE.IS_SIDEBAR_COLLAPSED) === "true"
  );

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => {
        setCollapsed(value);
        setLocalStorage(LOCAL_STORAGE.IS_SIDEBAR_COLLAPSED, value.toString());
      }}
      style={{
        minHeight: "100vh",
      }}
    >
      <div className='demo-logo-vertical' />
      <Menu
        theme='dark'
        defaultSelectedKeys={["1"]}
        mode='inline'
        items={items}
      />
    </Sider>
  );
}
