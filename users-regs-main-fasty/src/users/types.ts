// src/users/types.ts
export type CreateUserInput = {
  visitorId: string;
  clientIp?: string | null;
  name?: string | null;
  email: string; // делаем обязательным, как у тебя в логике
  browserData?: Record<string, any> | null;
  source: string;
};

export type GetUserInput = {
  visitorId: string;
};