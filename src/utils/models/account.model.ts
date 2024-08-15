export type TAccountCreateRequest = {
  name: string;
  email: string;
  vendorUserRoleId: string;
};

export type TAccountUpdateRequest = {
  name?: string;
  email?: string;
  password?: string;
  vendorUserRoleId?: string;
};
