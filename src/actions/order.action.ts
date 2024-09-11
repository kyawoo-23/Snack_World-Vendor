"use server";

import { revalidatePath } from "next/cache";
import { post } from "@/utils/api";
import { TOrderAcceptRequest } from "@/utils/models/order.model";

export async function acceptOrder(payload: TOrderAcceptRequest) {
  const res = await post("delivery-order", payload);
  res.isSuccess && revalidatePath("/order/[id]");
  return res;
}

export async function startDeliveryOrder(id: string) {
  const res = await post(`delivery-order/${id}/start`);
  res.isSuccess && revalidatePath("/order/[id]");
  return res;
}

export async function endDeliveryOrder(id: string) {
  const res = await post(`delivery-order/${id}/end`);
  res.isSuccess && revalidatePath("/order/[id]");
  return res;
}
