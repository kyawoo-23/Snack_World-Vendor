import { FileType } from "@/utils/models";

export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const calculateTotalStock = (products: any[]) => {
  return products.reduce((acc, curr) => acc + curr.stock, 0);
};
