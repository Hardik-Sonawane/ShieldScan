from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    clerk_id = Column(String, unique=True, index=True, nullable=True) # Will map to our frontend clerk user
    email = Column(String, unique=True, index=True)
    is_premium = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=True) # Optional for guest scans
    target_url = Column(String, index=True)
    score = Column(Integer)
    grade = Column(String)
    issues_found = Column(Integer)
    raw_result = Column(Text) # JSON serialized blob of the full report
    created_at = Column(DateTime(timezone=True), server_default=func.now())
