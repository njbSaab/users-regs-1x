// types/index.ts
export interface RegisterRequest {
  // Для партнёра (было)
  email?: string;
  tag?: string;
  pb?: string;
  click_id?: string;
  custom_login_link?: string;
  country?: string;
  currency?: string;

  // Для сервера юзеров (НОВОЕ — сервер 1 перешлёт на сервер 2)
  visitorId?: string;
  clientIp?: string;
  name?: string;
  browserData?: Record<string, any>;
  source?: string;
  siteUrl?: string;
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