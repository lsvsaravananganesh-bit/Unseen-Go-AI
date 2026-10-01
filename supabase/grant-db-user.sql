-- =====================================================================
-- UnseenGo AI — Database Role Grants for `lsvsaravananganesh_db_user`
-- Run this in your PostgreSQL / Supabase SQL Editor to grant full
-- schema and table permissions to your database user.
-- =====================================================================

-- 1. Ensure user exists (if not created yet, uncomment and set password)
-- DO $$
-- BEGIN
--   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'lsvsaravananganesh_db_user') THEN
--     CREATE ROLE lsvsaravananganesh_db_user WITH LOGIN PASSWORD 'your_password_here';
--   END IF;
-- END
-- $$;

-- 2. Grant schema usage
GRANT USAGE, CREATE ON SCHEMA public TO lsvsaravananganesh_db_user;

-- 3. Grant table permissions on existing tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO lsvsaravananganesh_db_user;

-- 4. Grant sequence permissions for auto-increment / UUID generators
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO lsvsaravananganesh_db_user;

-- 5. Grant execute permissions on custom functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO lsvsaravananganesh_db_user;

-- 6. Set default privileges for any future tables and sequences created
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO lsvsaravananganesh_db_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO lsvsaravananganesh_db_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO lsvsaravananganesh_db_user;

-- Confirmation
SELECT 'Permissions successfully granted to lsvsaravananganesh_db_user' AS status;
