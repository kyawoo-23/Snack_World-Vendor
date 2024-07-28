export type BaseResponse<T> = {
  data: T;
  message: string;
  isSuccess: boolean;
  error: string;
};
