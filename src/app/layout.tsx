import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Inter } from "next/font/google";
import "./globals.css";
import { App, Layout } from "antd";

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
        <NextTopLoader color='#1676FE' />
        <AntdRegistry>
          <App
            message={{ maxCount: 1, duration: 1.5 }}
            notification={{ placement: "topRight" }}
          >
            <Layout
              style={{
                minHeight: "100vh",
              }}
            >
              {children}
            </Layout>
          </App>
        </AntdRegistry>
      </body>
    </html>
  );
}
