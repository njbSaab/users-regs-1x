module.exports = {
  apps: [
    {
      name: "users-reg-1x",
      script: "./dist/server.js",            // путь к скомпилированному файлу
      instances: "max",                      // используем все ядра CPU
      exec_mode: "cluster",                  // кластерный режим
      autorestart: true,
      watch: false,                          // не смотреть за файлами в проде
      max_memory_restart: "1G",              // перезапуск, если > 1 ГБ
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};