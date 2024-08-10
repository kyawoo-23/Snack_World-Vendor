type ResponseWithMessage = {
  message: string;
  isSuccess: boolean;
  error: string;
};

type ResponseWithData<T> = {
  data: T;
} & ResponseWithMessage;

export type BaseResponse<T = void> = T extends void
  ? ResponseWithMessage
  : ResponseWithData<T>;
