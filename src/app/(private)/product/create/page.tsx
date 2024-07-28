import ProductCreateForm from "@/components/ClientForm/ProductCreateForm";
import MainLayout from "@/components/Layout/MainLayout";

export default function page() {
  return (
    <MainLayout title='Create new product'>
      <ProductCreateForm />
    </MainLayout>
  );
}
