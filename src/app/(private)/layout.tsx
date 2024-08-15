import Navbar from "@/components/Navbar";
import SideBar from "@/components/Sidebar";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SideBar />
      <div className='flex flex-col w-full'>
        <Navbar />
        <Layout className='py-4 px-2 max-w-[1440px]'>
          <Content style={{ margin: "0 16px" }}>{children}</Content>
        </Layout>
      </div>
    </>
  );
}
