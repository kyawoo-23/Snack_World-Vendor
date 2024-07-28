type ResponseWithMessage = {
  message: string;
  isSuccess: boolean;
  error: string;
};

interface ResponseWithData<T> extends ResponseWithMessage {
  data: T;
}

export type BaseResponse<T = void> = T extends void
  ? ResponseWithMessage
  : ResponseWithData<T>;
