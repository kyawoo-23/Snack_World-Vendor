"use client";

import { useEffect, useState } from "react";
import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocalStorage, setLocalStorage } from "@/utils/shared/local-storage";
import { LOCAL_STORAGE } from "@/utils/constants/local-storage.type";
import SkeletonButton from "antd/es/skeleton/Button";
import { FaRegFileLines } from "react-icons/fa6";
import { LuUsers2, LuBox } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { HiOutlineDocumentReport } from "react-icons/hi";
import Image from "next/image";
import { IoCartOutline } from "react-icons/io5";

type MenuItem = Required<MenuProps>["items"][number] & {
  link?: string;
  children?: MenuItem[];
};

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
    link,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Orders", "1", "/order", <FaRegFileLines />),
  getItem("Accounts", "2", "/account", <LuUsers2 />),
  getItem("Products", "3", "/product", <LuBox />),
  getItem("Purchase", "4", "/purchase", <IoCartOutline />),
  getItem("Delivery", "5", "/delivery", <TbTruckDelivery />),
  getItem("Report", "6", undefined, <HiOutlineDocumentReport />, [
    getItem("Sales", "6.1", "/sales"),
    getItem("Stock", "6.2", "/stock"),
  ]),
];

export default function SideBar() {
  const [isClient, setIsClient] = useState(false);
  const [collapsed, setCollapsed] = useState(
    getLocalStorage(LOCAL_STORAGE.IS_SIDEBAR_COLLAPSED) === "true"
  );
  const currentRoute = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getSelectedKeys = () => {
    const findMatchingItem = (
      items: MenuItem[],
      route: string
    ): string | undefined => {
      for (const item of items) {
        if (item.link && route.startsWith(item.link)) {
          return item.key as string;
        }
        if (item.children) {
          const matchingChildKey = findMatchingItem(item.children, route);
          if (matchingChildKey) {
            return matchingChildKey;
          }
        }
      }
      return undefined;
    };

    return [findMatchingItem(items, currentRoute) || "1"];
  };

  if (!isClient) {
    return (
      <Sider
        collapsed={true}
        style={{
          minHeight: "100vh",
        }}
      >
        {items.map((_, idx) => (
          <SkeletonButton
            key={idx}
            active={true}
            size={"large"}
            shape={"default"}
          />
        ))}
      </Sider>
    );
  }

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
      <figure className='flex justify-center w-full'>
        <Image
          objectFit='cover'
          src='/assets/logo/SNACK_WORLD_DARK.png'
          alt='SNACK WORLD'
          width={70}
          height={70}
          priority
        />
      </figure>

      <Menu
        theme='dark'
        selectedKeys={getSelectedKeys()}
        mode='inline'
        items={items}
      />
    </Sider>
  );
}
