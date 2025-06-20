-- Esto se ejecuta al iniciar el contenedor de MySQL
-- Crea un usuario con privilegios para las migraciones y una base de datos para la aplicación
GRANT ALL PRIVILEGES ON *.* TO 'may'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;