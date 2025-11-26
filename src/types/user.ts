export interface User {
  userId: string;
  userName?: string;
  userEmail?: string;
  userPhoneNo?: string;
  userBalance: number;
  roleName?: string;
}

export interface RegisterUser {
  userName?: string;
  userEmail?: string;
  userPhoneNo?: string;
  userPassword?: string;
  roleId: number;
}

export interface Login {
  email?: string;
  password?: string;
}
