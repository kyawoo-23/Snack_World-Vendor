"use server";

import { post } from "@/utils/api";
import { TOrderAcceptRequest } from "@/utils/models/order.model";

export async function acceptOrder(payload: TOrderAcceptRequest) {
  return await post("delivery-order", payload);
}
