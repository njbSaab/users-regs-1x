-- Миграция для преобразования текстовых полей в булевые
-- Сначала обновим существующие текстовые значения в нужный формат
UPDATE users SET is_validation = CASE WHEN is_validation = 'true' THEN 'true'::text WHEN is_validation = 'false' OR is_validation IS NULL THEN 'false'::text ELSE 'false'::text END WHERE is_validation IS NOT NULL;

-- Затем преобразуем столбцы с использованием USING выражения
ALTER TABLE "users" ALTER COLUMN "is_validation" TYPE boolean USING CASE WHEN "is_validation" = 'true' THEN true ELSE false END;
ALTER TABLE "users" ALTER COLUMN "is_deposited" TYPE boolean USING CASE WHEN "is_deposited" = 'true' THEN true ELSE false END;