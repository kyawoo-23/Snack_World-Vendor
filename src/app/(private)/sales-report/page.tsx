import MainLayout from "@/components/Layout/MainLayout";
import SalesReport from "@/components/pages/report/SalesReport";

export default async function page() {
  return (
    <MainLayout title='Sales Report'>
      <SalesReport />
    </MainLayout>
  );
}
