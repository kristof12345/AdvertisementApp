export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  phone: string;
  password: string;
}

export interface ChangePasswordRequest {
  userName: string;
  oldPassword: string;
  newPassword: string;
}
