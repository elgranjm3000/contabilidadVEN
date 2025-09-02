-- database/init.sql - Script de inicialización MySQL
-- Crear base de datos con charset correcto
CREATE DATABASE IF NOT EXISTS contabilidad_venezuela 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE contabilidad_venezuela;

-- Configurar timezone para Venezuela
SET time_zone = '-04:00';

-- Configurar modo SQL estricto para contabilidad
SET SESSION sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

-- Habilitar funciones para UUID
SET GLOBAL log_bin_trust_function_creators = 1;

-- Función personalizada para generar UUID en versiones antiguas de MySQL
DELIMITER $
CREATE FUNCTION IF NOT EXISTS UUID_SHORT_GENERATE() 
RETURNS VARCHAR(36) 
READS SQL DATA 
DETERMINISTIC
BEGIN
    RETURN UPPER(CONCAT(
        SUBSTRING(UUID(), 1, 8), '-',
        SUBSTRING(UUID(), 10, 4), '-',
        SUBSTRING(UUID(), 15, 4), '-',
        SUBSTRING(UUID(), 20, 4), '-',
        SUBSTRING(UUID(), 25, 12)
    ));
END$
DELIMITER ;