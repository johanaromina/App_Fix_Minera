-- Initial database setup for TFG Mineria
-- This file runs when the MySQL container starts for the first time

-- Create additional user for application
CREATE USER IF NOT EXISTS 'tfg_user'@'%' IDENTIFIED BY 'tfg_pass';
GRANT ALL PRIVILEGES ON tfg_mineria.* TO 'tfg_user'@'%';
FLUSH PRIVILEGES;

-- Set timezone
SET time_zone = '+00:00';
