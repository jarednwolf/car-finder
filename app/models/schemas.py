"""SQLAlchemy database models."""
from datetime import datetime
from typing import Optional, Any
from uuid import uuid4
from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Float, DateTime, JSON,
    ForeignKey, UniqueConstraint, Index, text
)
from sqlalchemy.dialects.postgresql import UUID, VECTOR
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from enum import Enum

from app.database import Base


class BodyStyle(str, Enum):
    """Car body style enumeration."""
    SUV = "SUV"
    SEDAN = "Sedan"
    COUPE = "Coupe"
    CONVERTIBLE = "Convertible"
    HATCHBACK = "Hatchback"


class Drivetrain(str, Enum):
    """Car drivetrain enumeration."""
    AWD = "AWD"
    RWD = "RWD"
    FWD = "FWD"


class FuelType(str, Enum):
    """Car fuel type enumeration."""
    GAS = "Gas"
    HYBRID = "Hybrid"
    PHEV = "PHEV"
    EV = "EV"


class CarPreference(BaseModel):
    """Pydantic model for car preferences JSON schema."""
    body_style: BodyStyle
    drivetrain: Drivetrain
    fuel_type: Optional[FuelType] = None
    min_power_hp: int
    must_have_options: list[str]
    budget_usd: Optional[int] = None
    brand_exclusions: Optional[list[str]] = Field(default_factory=list)


class User(Base):
    """User model."""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    settings = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    preferences = relationship("Preference", back_populates="user", cascade="all, delete-orphan")


class Conversation(Base):
    """Conversation model."""
    __tablename__ = "conversations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    ended_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.ts")


class Message(Base):
    """Message model."""
    __tablename__ = "messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id"), nullable=False, index=True)
    from_user = Column(Boolean, nullable=False)
    content = Column(Text, nullable=False)
    ts = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")


class Preference(Base):
    """User preference model."""
    __tablename__ = "preferences"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    car_pref = Column(JSON, nullable=False)  # CarPreference JSON
    embedding = Column(VECTOR(1536), nullable=True)  # OpenAI ada-002 embeddings
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="preferences")
    alerts = relationship("Alert", back_populates="preference", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('idx_preference_embedding', 'embedding', postgresql_using='ivfflat'),
    )


class Listing(Base):
    """Car listing model."""
    __tablename__ = "listings"
    
    vin = Column(String(17), primary_key=True)
    source = Column(String(50), nullable=False)  # marketcheck, autodev, etc.
    attrs = Column(JSON, nullable=False)  # Full listing data
    embedding = Column(VECTOR(1536), nullable=True)  # Embedding of description + options
    decoded_at = Column(DateTime, nullable=True)  # When VIN was decoded
    enriched_at = Column(DateTime, nullable=True)  # When options were enriched
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    alerts = relationship("Alert", back_populates="listing")
    
    __table_args__ = (
        Index('idx_listing_embedding', 'embedding', postgresql_using='ivfflat'),
        Index('idx_listing_created', 'created_at'),
    )


class Alert(Base):
    """Alert model for matching listings to preferences."""
    __tablename__ = "alerts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    preference_id = Column(UUID(as_uuid=True), ForeignKey("preferences.id"), nullable=False, index=True)
    vin = Column(String(17), ForeignKey("listings.vin"), nullable=False, index=True)
    similarity_score = Column(Float, nullable=False)
    sent_at = Column(DateTime, nullable=True)
    viewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    preference = relationship("Preference", back_populates="alerts")
    listing = relationship("Listing", back_populates="alerts")
    
    __table_args__ = (
        UniqueConstraint('preference_id', 'vin', name='uq_alert_preference_vin'),
        Index('idx_alert_created', 'created_at'),
    ) 