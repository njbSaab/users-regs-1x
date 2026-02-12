// js/api/email.js
import { ENV } from '../const.js';

export async function sendCode(email) {
  const res = await fetch(`${ENV.emailProviderUrl}/api/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain: ENV.DOMAIN, email: email.trim() }),
  });

  const data = await res.json();
  if (data.success) return data;
  throw new Error(data.error || "Không thể gửi mã");
}

export async function verifyCode({ email, code, name }) {
  const res = await fetch(`${ENV.emailProviderUrl}/api/verify-and-send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      domain: ENV.DOMAIN,
      email: email.trim(),
      code,
      name: name?.trim() || "bạn",
    }),
  });

  const data = await res.json();
  if (data.success) return data;
  throw new Error(data.error || "Неверный код");
}