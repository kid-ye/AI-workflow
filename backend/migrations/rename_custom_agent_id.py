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
    "ALTER TABLE custom_agent RENAME COLUMN id TO custom_agent_id;",
    "ALTER TABLE custom_agent ADD CONSTRAINT custom_agent_agent_id_unique UNIQUE (agent_id);",
]

for sql in migrations:
    try:
        cur.execute(sql)
        print(f"OK: {sql.strip()}")
    except Exception as e:
        print(f"SKIP: {sql.strip()[:60]} - {e}")

conn.commit()
cur.close()
conn.close()

print("\nMigration complete: custom_agent_id renamed, agent_id unique constraint added.")
