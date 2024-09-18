import MainLayout from "@/components/Layout/MainLayout";
import ProductReport from "@/components/pages/report/ProductReport";

export default function page() {
  return (
    <MainLayout title='Product Report'>
      <ProductReport />
    </MainLayout>
  );
}
