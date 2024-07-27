import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Inter } from "next/font/google";
import "./globals.css";
import { Layout } from "antd";

import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vendor Dashboard",
  description: "Developed by Kyaw Kyaw Oo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <NextTopLoader />
        <AntdRegistry>
          <Layout
            style={{
              minHeight: "100vh",
            }}
          >
            {children}
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
