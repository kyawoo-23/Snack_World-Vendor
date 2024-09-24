"use client";

import { ROLES } from "@/utils/constants";
import { getUserRole } from "@/utils/shared/local-storage";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isRoleChecked, setIsRoleChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const role = getUserRole();

    if (role !== ROLES.ADMINSTRATOR) {
      router.push("/order");
    } else {
      setIsRoleChecked(true);
    }
  }, [router]);

  if (!isRoleChecked) {
    return (
      <div className='h-[90vh] grid place-items-center'>
        <Spin indicator={<LoadingOutlined spin />} size='default' />
      </div>
    );
  }

  return <>{children}</>;
}
