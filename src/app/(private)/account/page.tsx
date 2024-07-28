import MainLayout from "@/components/Layout/MainLayout";
import React from "react";

export default function page() {
  return (
    <MainLayout
      title='Account'
      action={{
        label: "Create Account",
        href: "/account/create",
      }}
    >
      <div></div>
    </MainLayout>
  );
}
