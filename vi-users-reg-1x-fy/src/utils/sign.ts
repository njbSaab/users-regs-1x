import crypto from 'crypto';

/**
 * Генерирует MD5 подпись для запроса.
 * Алгоритм: md5(secret + id + phone + email)
 */
export const generateSign = (
  secret: string, 
  id: string, 
  email: string, 
  phone: string = '' // По дефолту пустая строка, как в вашем примере
): string => {
  
  // Собираем строку строго в том порядке, как требует партнерка
  const stringToHash = secret + id + phone + email;

  const sign = crypto
    .createHash('md5')
    .update(stringToHash)
    .digest('hex');

  // --- ЛОГИРОВАНИЕ (как вы просили) ---
  console.log('\n>>> [UTILS] GENERATE SIGN DEBUG');
  console.log(`1. Secret: ${secret.slice(0, 4)}***`); // Скрываем часть секрета для безопасности логов
  console.log(`2. ID: ${id}`);
  console.log(`3. Phone: '${phone}'`);
  console.log(`4. Email: ${email}`);
  console.log(`---`);
  console.log(`RAW STRING: ${stringToHash}`); // Та самая строка, которая хешируется
  console.log(`RESULT MD5: ${sign}`);         // Должно получиться 89397f4db01501a5783c9ca56079f88b
  console.log('<<<\n');
  // ------------------------------------

  return sign;
};