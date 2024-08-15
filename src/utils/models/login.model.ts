export type TLoginRequest = {
  email: string;
  password: string;
};

export type TLoginResponse = {
  accessToken: string;
  name: string;
  role: string;
  sub: string;
  email: string;
};
