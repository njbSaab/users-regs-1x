// types/index.ts
export interface RegisterRequest {
  email?: string;
  tag?: string;
  pb?: string;
  click_id?: string;
  custom_login_link?: string;
  country?: string;
  currency?: string;
}

export interface RegisterResponse {
  success: true;
  login: string;
  password: string;
  domain: string;
  autologin: string;
  deposit: string;
  main: string;
  custom_login_link?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  code?: number;
}