#!/usr/bin/env python3
"""End-to-end demo script for Car Finder application."""
import asyncio
import json
import sys
import time
from uuid import uuid4
from datetime import datetime

import httpx
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

# Add parent directory to path
sys.path.append('/app')

from app.config import settings
from app.models.schemas import User, Preference, Listing, Alert, CarPreference
from app.tasks.celery_app import ingest_listings, enrich_and_match


async def create_demo_user(db: Session) -> User:
    """Create a demo user for testing."""
    email = f"demo_{uuid4().hex[:8]}@carfinder.ai"
    user = User(email=email)
    db.add(user)
    db.commit()
    print(f"✅ Created demo user: {email}")
    return user


async def simulate_chat_conversation(user_id: str) -> str:
    """Simulate a chat conversation and save preferences."""
    print("\n🤖 Starting chat conversation...")
    
    async with httpx.AsyncClient() as client:
        # Start conversation
        messages = [
            "I'm looking for a reliable SUV",
            "My budget is around $40,000",
            "I need AWD for winter driving",
            "Leather seats and adaptive cruise control are must-haves",
            "I prefer gas or hybrid, not fully electric",
            "save preferences"
        ]
        
        conversation_id = None
        
        for i, message in enumerate(messages):
            print(f"\n👤 User: {message}")
            
            response = await client.post(
                "http://localhost:8000/api/chat/",
                json={
                    "message": message,
                    "user_id": str(user_id),
                    "conversation_id": conversation_id
                }
            )
            
            if response.status_code == 200:
                # Get conversation ID from headers
                if not conversation_id:
                    conversation_id = response.headers.get("X-Conversation-ID")
                
                # Read streaming response
                print("🤖 Assistant: ", end="", flush=True)
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        try:
                            data = json.loads(line[6:])
                            if data.get("content"):
                                print(data["content"], end="", flush=True)
                            elif data.get("event") == "preferences_saved":
                                print("\n✅ Preferences saved!")
                        except json.JSONDecodeError:
                            pass
                print()  # New line after response
            else:
                print(f"❌ Chat error: {response.status_code}")
                return None
            
            # Small delay between messages
            await asyncio.sleep(1)
        
        return conversation_id


def create_test_preference(db: Session, user: User) -> Preference:
    """Create a test preference directly in the database."""
    print("\n📝 Creating test preference...")
    
    car_pref = CarPreference(
        body_style="SUV",
        drivetrain="AWD",
        fuel_type="Hybrid",
        min_power_hp=250,
        must_have_options=["Leather Seats", "Adaptive Cruise Control", "Blind Spot Monitoring"],
        budget_usd=45000,
        brand_exclusions=[]
    )
    
    preference = Preference(
        user_id=user.id,
        car_pref=car_pref.model_dump(),
        is_active=True
    )
    
    # Generate embedding for the preference
    from app.tasks.celery_app import create_listing_description, generate_embedding
    
    pref_description = f"{car_pref.body_style} {car_pref.drivetrain} {car_pref.fuel_type or 'Any fuel'} " \
                      f"min {car_pref.min_power_hp}hp " \
                      f"Options: {', '.join(car_pref.must_have_options)} " \
                      f"Budget: ${car_pref.budget_usd}"
    
    preference.embedding = generate_embedding(pref_description)
    
    db.add(preference)
    db.commit()
    
    print(f"✅ Created preference: {preference.id}")
    return preference


def create_test_listing(db: Session) -> Listing:
    """Create a test listing that should match the preference."""
    print("\n🚗 Creating test listing...")
    
    vin = f"TEST{uuid4().hex[:13].upper()}"
    
    listing_data = {
        "vin": vin,
        "source": "test",
        "make": "Toyota",
        "model": "Highlander",
        "year": 2023,
        "trim": "XLE",
        "body_type": "SUV",
        "drivetrain": "AWD",
        "fuel_type": "Hybrid",
        "engine": "2.5L 4-Cylinder",
        "transmission": "CVT",
        "exterior_color": "Pearl White",
        "interior_color": "Black Leather",
        "price": 42500,
        "mileage": 5234,
        "dealer": {
            "name": "Test Toyota",
            "city": "Phoenix",
            "state": "AZ",
            "zip": "85295",
            "phone": "555-0123",
            "website": "https://example.com"
        },
        "listing_url": "https://example.com/listing/12345",
        "photos": [],
        "description": "Beautiful 2023 Toyota Highlander Hybrid with all the bells and whistles",
        "features": [
            "Leather Seats",
            "Adaptive Cruise Control",
            "Blind Spot Monitoring",
            "Lane Keep Assist",
            "Heated Seats",
            "Apple CarPlay",
            "Android Auto",
            "Panoramic Sunroof"
        ],
        "raw_data": {},
        "fetched_at": datetime.utcnow().isoformat()
    }
    
    listing = Listing(
        vin=vin,
        source="test",
        attrs=listing_data
    )
    
    db.add(listing)
    db.commit()
    
    print(f"✅ Created test listing: {vin}")
    return listing


def check_alerts(db: Session, user: User) -> list[Alert]:
    """Check for generated alerts."""
    print("\n🔔 Checking for alerts...")
    
    alerts = db.query(Alert).join(
        Preference
    ).filter(
        Preference.user_id == user.id
    ).all()
    
    return alerts


async def main():
    """Run the end-to-end demo."""
    print("🚀 Starting Car Finder E2E Demo")
    print("=" * 50)
    
    # Create database engine
    engine = create_engine(settings.database_url.replace("+asyncpg", ""))
    
    with Session(engine) as db:
        # Step 1: Create demo user
        user = await create_demo_user(db)
        
        # Step 2: Simulate chat conversation (optional, can be skipped)
        # conversation_id = await simulate_chat_conversation(user.id)
        
        # Step 3: Create test preference directly
        preference = create_test_preference(db, user)
        
        # Step 4: Create test listing
        listing = create_test_listing(db)
        
        # Step 5: Run enrichment task
        print("\n⚙️ Running enrichment task...")
        result = enrich_and_match(listing.vin)
        print(f"Enrichment result: {result}")
        
        # Step 6: Check for alerts
        time.sleep(2)  # Give it a moment to process
        alerts = check_alerts(db, user)
        
        print(f"\n📊 Found {len(alerts)} alerts")
        
        for alert in alerts:
            listing_attrs = alert.listing.attrs
            print(f"\n🎯 Alert {alert.id}")
            print(f"   Vehicle: {listing_attrs['year']} {listing_attrs['make']} {listing_attrs['model']}")
            print(f"   Price: ${listing_attrs['price']:,}")
            print(f"   Similarity: {alert.similarity_score:.2%}")
            print(f"   VIN: {alert.vin}")
        
        if alerts:
            print("\n✅ E2E Demo completed successfully!")
            print(f"   - Created user: {user.email}")
            print(f"   - Created preference: {preference.id}")
            print(f"   - Created listing: {listing.vin}")
            print(f"   - Generated {len(alerts)} alert(s)")
        else:
            print("\n⚠️ No alerts were generated. Check the matching logic.")
    
    print("\n" + "=" * 50)
    print("Demo complete!")


if __name__ == "__main__":
    asyncio.run(main()) 