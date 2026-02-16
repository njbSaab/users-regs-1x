-- Скрипт для ручного преобразования текстовых полей в булевые
-- Выполните эти команды в вашей PostgreSQL базе данных

-- Сначала обновим все текстовые значения в нужный формат
UPDATE users SET is_validation = 'true' WHERE is_validation = 'true' OR is_validation = 'TRUE' OR is_validation = '1';
UPDATE users SET is_validation = 'false' WHERE is_validation = 'false' OR is_validation = 'FALSE' OR is_validation = '0' OR is_validation IS NULL OR is_validation = '';
UPDATE users SET is_deposited = 'true' WHERE is_deposited = 'true' OR is_deposited = 'TRUE' OR is_deposited = '1';
UPDATE users SET is_deposited = 'false' WHERE is_deposited = 'false' OR is_deposited = 'FALSE' OR is_deposited = '0' OR is_deposited IS NULL OR is_deposited = '';

-- Затем преобразуем столбцы с использованием USING выражения
ALTER TABLE "users" ALTER COLUMN "is_validation" TYPE boolean USING CASE WHEN "is_validation" = 'true' THEN true ELSE false END;
ALTER TABLE "users" ALTER COLUMN "is_deposited" TYPE boolean USING CASE WHEN "is_deposited" = 'true' THEN true ELSE false END;

-- Проверьте результат
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('is_validation', 'is_deposited');