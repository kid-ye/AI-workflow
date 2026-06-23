import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

url = os.getenv("DATABASE_URL").replace("postgresql://", "")
user_pass, rest = url.split("@")
user, password = user_pass.split(":")
host_port, dbname = rest.split("/")
host, port = host_port.split(":")

conn = psycopg2.connect(host=host, port=port, dbname=dbname, user=user, password=password)
cur = conn.cursor()

migrations = [
    # users table
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR;",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();",

    # auth_providers table
    """
    CREATE TABLE IF NOT EXISTS auth_providers (
        id VARCHAR PRIMARY KEY,
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        provider VARCHAR NOT NULL,
        provider_user_id VARCHAR NOT NULL,
        profile_picture_url VARCHAR,
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    """,

    # refresh_tokens table
    """
    CREATE TABLE IF NOT EXISTS refresh_tokens (
        id VARCHAR PRIMARY KEY,
        user_id VARCHAR NOT NULL,
        token VARCHAR UNIQUE NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        is_revoked BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        revoked_at TIMESTAMPTZ
    );
    """,

    # custom_agent table new columns
    "ALTER TABLE custom_agent ADD COLUMN IF NOT EXISTS stt_model_id VARCHAR;",
    "ALTER TABLE custom_agent ADD COLUMN IF NOT EXISTS llm_model_id VARCHAR;",
    "ALTER TABLE custom_agent ADD COLUMN IF NOT EXISTS tts_model_id VARCHAR;",
    "ALTER TABLE custom_agent ADD COLUMN IF NOT EXISTS tts_pace FLOAT;",
    "ALTER TABLE custom_agent ADD COLUMN IF NOT EXISTS tts_temperature FLOAT;",
    "ALTER TABLE custom_agent ADD COLUMN IF NOT EXISTS llm_temperature FLOAT;",
    "ALTER TABLE custom_agent ADD COLUMN IF NOT EXISTS stt_language VARCHAR;",
    "ALTER TABLE custom_agent ADD COLUMN IF NOT EXISTS stt_language_code VARCHAR;",
    "ALTER TABLE custom_agent ADD COLUMN IF NOT EXISTS tts_language VARCHAR;",
    "ALTER TABLE custom_agent ADD COLUMN IF NOT EXISTS tts_language_code VARCHAR;",
]

for sql in migrations:
    cur.execute(sql)
    print(f"OK: {sql.strip()[:60]}")

conn.commit()
cur.close()
conn.close()

print("\nAll migrations complete.")
