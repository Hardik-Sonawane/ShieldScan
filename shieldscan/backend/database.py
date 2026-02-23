import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

# Use PostgreSQL if a DATABASE_URL is provided (e.g., Supabase Postgres DB URL)
# Otherwise, fallback to SQLite for local MVP testing
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./shieldscan.db")

# If using Postgres, we don't need checkout_same_thread=False
# This specific check differentiates between SQLite and Postgres strings
connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
