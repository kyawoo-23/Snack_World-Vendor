import { FileType } from "@/utils/models";
import { TimeRangePickerProps } from "antd";
import dayjs from "dayjs";

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

export const getImageKey = (image: string): string => {
  return image.split("/").pop() as string;
};

export function generatePurchaseCode() {
  const now = new Date();
  const pad = (num: number): string => String(num).padStart(2, "0");

  const dateTime = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("");

  const milliseconds = now.getMilliseconds();

  return `PUR-${dateTime}-${milliseconds}`;
}

export const rangePresets: TimeRangePickerProps["presets"] = [
  { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
];
