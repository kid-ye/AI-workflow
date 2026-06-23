"""
Migration script to add password_hash column to users table
"""
from sqlalchemy import text
from app.db.session import engine

def migrate():
    with engine.connect() as conn:
        # Add password_hash column if it doesn't exist
        conn.execute(text("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS password_hash VARCHAR;
        """))
        conn.commit()
        print("✓ Added password_hash column to users table")

if __name__ == "__main__":
    migrate()
    print("Migration completed successfully!")
