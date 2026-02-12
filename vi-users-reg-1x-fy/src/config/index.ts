import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 3000,
  partner: {
    id: process.env.PARTNER_1X_ID!,
    secret: process.env.PARTNER_1X_SECRET!,
    apiUrl: process.env.PARTNER_1X_API!,
  },
  defaults: {
    country: process.env.DEFAULT_COUNTRY || 'VN',
    currency: process.env.DEFAULT_CURRENCY || 'USDT', // Изменили на USDT согласно вашему curl
  },
} as const;

if (!config.partner.id || !config.partner.secret || !config.partner.apiUrl) {
  console.error('Ошибка: заполни .env (PARTNER_1X_* переменные)');
  process.exit(1);
}