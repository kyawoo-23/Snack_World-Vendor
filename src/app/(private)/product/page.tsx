import ProductCreateForm from "@/components/pages/product/ProductCreateForm";
import MainLayout from "@/components/Layout/MainLayout";

export default function page() {
  return (
    <MainLayout
      title='Products'
      action={{
        label: "Create Product",
        href: "/product/create",
      }}
    >
      <div></div>
    </MainLayout>
  );
}
