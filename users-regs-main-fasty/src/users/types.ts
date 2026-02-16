// src/users/types.ts
export type CreateUserInput = {
  visitorId: string;
  clientIp?: string | null;
  name?: string | null;
  email: string; // делаем обязательным, как у тебя в логике
  browserData?: Record<string, any> | null;
  source: string;
  siteUrl?: string;
  isValidation?: boolean;
  login?: string | number;
  password?: string;
  deposit?: string;
  main?: string;
  domain?: string;
  isDeposited?: boolean; // по умолчанию false
};

export type UpdateUserInput = Partial<CreateUserInput>;

export type GetUserInput = {
  visitorId: string;
};