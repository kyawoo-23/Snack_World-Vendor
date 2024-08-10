"use server";

import { post } from "@/utils/api";
import { BaseResponse } from "@/utils/constants/response.type";
import { TLoginRequest, TLoginResponse } from "@/utils/models/login.model";

export async function login(
  request: TLoginRequest
): Promise<BaseResponse<TLoginResponse>> {
  const res = await post<TLoginResponse, TLoginRequest>(
    "vendor-user/login",
    request
  );

  return res;
}
