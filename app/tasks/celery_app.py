"""Celery application configuration and tasks."""
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
import json

from celery import Celery
from sqlalchemy import select, and_
from sqlalchemy.orm import Session
import httpx
from openai import OpenAI
import numpy as np

from app.config import settings
from app.database import engine
from app.models.schemas import Listing, Preference, Alert


logger = logging.getLogger(__name__)

# Create Celery app
celery_app = Celery(
    "car_finder",
    broker=settings.redis_url,
    backend=settings.redis_url
)

# Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_routes={
        "app.tasks.celery_app.enrich_and_match": "enrichment",
        "app.tasks.celery_app.ingest_listings": "ingest",
        "app.tasks.celery_app.send_alerts": "notifications"
    }
)

# Initialize OpenAI client for embeddings
openai_client = OpenAI(api_key=settings.openai_api_key)


@celery_app.task(name="app.tasks.celery_app.enrich_and_match")
def enrich_and_match(vin: str) -> Dict[str, Any]:
    """Enrich a listing and match against user preferences.
    
    Args:
        vin: Vehicle Identification Number
        
    Returns:
        Dictionary with enrichment results and matches
    """
    logger.info(f"Starting enrichment for VIN: {vin}")
    
    # Use synchronous session for Celery task
    with Session(engine) as db:
        # Get listing
        listing = db.query(Listing).filter(Listing.vin == vin).first()
        if not listing:
            logger.error(f"Listing not found for VIN: {vin}")
            return {"error": "Listing not found"}
        
        # Skip if already enriched
        if listing.enriched_at:
            logger.info(f"VIN {vin} already enriched")
            return {"status": "already_enriched"}
        
        try:
            # Decode VIN (mock for now)
            decoded_info = decode_vin(vin)
            
            # Get build sheet / options (mock for now)
            options = get_vehicle_options(vin, listing.attrs)
            
            # Create description for embedding
            description = create_listing_description(listing.attrs, decoded_info, options)
            
            # Generate embedding
            embedding = generate_embedding(description)
            
            # Update listing
            listing.decoded_at = datetime.utcnow()
            listing.enriched_at = datetime.utcnow()
            listing.embedding = embedding
            listing.attrs = {
                **listing.attrs,
                "decoded_info": decoded_info,
                "options": options
            }
            
            # Find matching preferences
            matches = find_matching_preferences(db, listing, embedding)
            
            # Create alerts for matches
            alerts_created = []
            for preference_id, similarity_score in matches:
                # Check if alert already exists
                existing_alert = db.query(Alert).filter(
                    and_(
                        Alert.preference_id == preference_id,
                        Alert.vin == vin
                    )
                ).first()
                
                if not existing_alert:
                    alert = Alert(
                        preference_id=preference_id,
                        vin=vin,
                        similarity_score=similarity_score
                    )
                    db.add(alert)
                    alerts_created.append(str(alert.id))
                    
                    # Queue notification task
                    send_alerts.delay(str(alert.id))
            
            db.commit()
            
            logger.info(f"Enrichment complete for VIN {vin}. Created {len(alerts_created)} alerts.")
            
            return {
                "status": "success",
                "vin": vin,
                "alerts_created": alerts_created,
                "matches_found": len(matches)
            }
            
        except Exception as e:
            logger.error(f"Error enriching VIN {vin}: {e}")
            db.rollback()
            return {"error": str(e)}


@celery_app.task(name="app.tasks.celery_app.ingest_listings")
def ingest_listings(zip_code: str, radius: int = 50) -> Dict[str, Any]:
    """Ingest listings from all sources for a given location.
    
    Args:
        zip_code: ZIP code to search around
        radius: Search radius in miles
        
    Returns:
        Dictionary with ingestion results
    """
    logger.info(f"Starting listing ingestion for ZIP: {zip_code}, radius: {radius}")
    
    results = {
        "marketcheck": 0,
        "autodev": 0,
        "new_listings": 0,
        "errors": []
    }
    
    # Import here to avoid circular imports
    from app.ingest import marketcheck, autodev
    import asyncio
    
    # Run async functions in sync context
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        # Fetch from Marketcheck
        try:
            mc_listings = loop.run_until_complete(
                marketcheck.get_listings(zip_code, radius)
            )
            results["marketcheck"] = len(mc_listings)
            
            # Save listings
            new_count = save_listings(mc_listings)
            results["new_listings"] += new_count
            
        except Exception as e:
            logger.error(f"Marketcheck ingestion error: {e}")
            results["errors"].append(f"Marketcheck: {str(e)}")
        
        # Fetch from Auto.dev
        try:
            ad_listings = loop.run_until_complete(
                autodev.get_listings(zip_code, radius)
            )
            results["autodev"] = len(ad_listings)
            
            # Save listings
            new_count = save_listings(ad_listings)
            results["new_listings"] += new_count
            
        except Exception as e:
            logger.error(f"Auto.dev ingestion error: {e}")
            results["errors"].append(f"Auto.dev: {str(e)}")
        
    finally:
        loop.close()
    
    logger.info(f"Ingestion complete. Total new listings: {results['new_listings']}")
    return results


@celery_app.task(name="app.tasks.celery_app.send_alerts")
def send_alerts(alert_id: str) -> Dict[str, Any]:
    """Send notification for an alert.
    
    Args:
        alert_id: Alert ID to send
        
    Returns:
        Dictionary with notification results
    """
    logger.info(f"Sending alert: {alert_id}")
    
    # TODO: Implement actual notification logic
    # For now, just mark as sent
    with Session(engine) as db:
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if alert:
            alert.sent_at = datetime.utcnow()
            db.commit()
            return {"status": "sent", "alert_id": alert_id}
        else:
            return {"error": "Alert not found"}


def decode_vin(vin: str) -> Dict[str, Any]:
    """Decode VIN using vPIC API.
    
    Args:
        vin: Vehicle Identification Number
        
    Returns:
        Decoded VIN information
    """
    # TODO: Implement actual vPIC API call
    # Mock response for now
    return {
        "Make": "Toyota",
        "Model": "RAV4",
        "ModelYear": "2023",
        "PlantCountry": "Japan",
        "VehicleType": "MULTIPURPOSE PASSENGER VEHICLE (MPV)",
        "BodyClass": "Sport Utility Vehicle (SUV)",
        "EngineCylinders": "4",
        "DisplacementL": "2.5",
        "FuelTypePrimary": "Gasoline"
    }


def get_vehicle_options(vin: str, listing_attrs: Dict[str, Any]) -> List[str]:
    """Get vehicle options from VINAnalytics or parse from listing.
    
    Args:
        vin: Vehicle Identification Number
        listing_attrs: Listing attributes
        
    Returns:
        List of vehicle options
    """
    # TODO: Implement VINAnalytics API call
    # For now, extract from listing features
    features = listing_attrs.get("features", [])
    
    # Standardize common options
    standardized_options = []
    option_mapping = {
        "leather": "Leather Seats",
        "sunroof": "Sunroof/Moonroof",
        "navigation": "Navigation System",
        "backup camera": "Backup Camera",
        "blind spot": "Blind Spot Monitoring",
        "adaptive cruise": "Adaptive Cruise Control",
        "lane keep": "Lane Keep Assist",
        "heated seats": "Heated Seats",
        "cooled seats": "Ventilated Seats",
        "awd": "All-Wheel Drive",
        "4wd": "Four-Wheel Drive"
    }
    
    for feature in features:
        feature_lower = feature.lower()
        for key, value in option_mapping.items():
            if key in feature_lower:
                standardized_options.append(value)
    
    return list(set(standardized_options))


def create_listing_description(
    listing_attrs: Dict[str, Any],
    decoded_info: Dict[str, Any],
    options: List[str]
) -> str:
    """Create a comprehensive description for embedding.
    
    Args:
        listing_attrs: Listing attributes
        decoded_info: Decoded VIN information
        options: Vehicle options
        
    Returns:
        Description string for embedding
    """
    parts = []
    
    # Basic vehicle info
    parts.append(f"{listing_attrs.get('year')} {listing_attrs.get('make')} {listing_attrs.get('model')}")
    
    if listing_attrs.get('trim'):
        parts.append(f"Trim: {listing_attrs['trim']}")
    
    # Body and drivetrain
    if listing_attrs.get('body_type'):
        parts.append(f"Body: {listing_attrs['body_type']}")
    if listing_attrs.get('drivetrain'):
        parts.append(f"Drivetrain: {listing_attrs['drivetrain']}")
    
    # Engine and fuel
    if decoded_info.get('EngineCylinders'):
        parts.append(f"Engine: {decoded_info['EngineCylinders']} cylinder")
    if listing_attrs.get('fuel_type'):
        parts.append(f"Fuel: {listing_attrs['fuel_type']}")
    
    # Options
    if options:
        parts.append(f"Options: {', '.join(options)}")
    
    # Description
    if listing_attrs.get('description'):
        parts.append(listing_attrs['description'][:500])  # Limit length
    
    return " | ".join(parts)


def generate_embedding(text: str) -> List[float]:
    """Generate embedding using OpenAI.
    
    Args:
        text: Text to embed
        
    Returns:
        Embedding vector
    """
    try:
        response = openai_client.embeddings.create(
            model="text-embedding-ada-002",
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"Error generating embedding: {e}")
        # Return zero vector on error
        return [0.0] * 1536


def find_matching_preferences(
    db: Session,
    listing: Listing,
    embedding: List[float]
) -> List[tuple[str, float]]:
    """Find preferences that match a listing.
    
    Args:
        db: Database session
        listing: Listing to match
        embedding: Listing embedding vector
        
    Returns:
        List of (preference_id, similarity_score) tuples
    """
    # Get active preferences with embeddings
    preferences = db.query(Preference).filter(
        and_(
            Preference.is_active == True,
            Preference.embedding.isnot(None)
        )
    ).all()
    
    matches = []
    listing_attrs = listing.attrs
    
    for preference in preferences:
        # Basic filtering based on preference criteria
        car_pref = preference.car_pref
        
        # Check body style
        if car_pref.get("body_style") and listing_attrs.get("body_type"):
            if car_pref["body_style"].lower() != listing_attrs["body_type"].lower():
                continue
        
        # Check drivetrain
        if car_pref.get("drivetrain") and listing_attrs.get("drivetrain"):
            if car_pref["drivetrain"] != listing_attrs["drivetrain"]:
                continue
        
        # Check budget
        if car_pref.get("budget_usd") and listing_attrs.get("price"):
            if listing_attrs["price"] > car_pref["budget_usd"]:
                continue
        
        # Check brand exclusions
        if car_pref.get("brand_exclusions") and listing_attrs.get("make"):
            if listing_attrs["make"] in car_pref["brand_exclusions"]:
                continue
        
        # Calculate similarity if embeddings exist
        if preference.embedding and embedding:
            similarity = calculate_cosine_similarity(
                preference.embedding,
                embedding
            )
            
            # Threshold for matching (adjust as needed)
            if similarity > 0.8:
                matches.append((preference.id, similarity))
    
    # Sort by similarity score
    matches.sort(key=lambda x: x[1], reverse=True)
    
    return matches


def calculate_cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two vectors.
    
    Args:
        vec1: First vector
        vec2: Second vector
        
    Returns:
        Cosine similarity score
    """
    try:
        vec1_np = np.array(vec1)
        vec2_np = np.array(vec2)
        
        dot_product = np.dot(vec1_np, vec2_np)
        norm1 = np.linalg.norm(vec1_np)
        norm2 = np.linalg.norm(vec2_np)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot_product / (norm1 * norm2)
    except Exception as e:
        logger.error(f"Error calculating similarity: {e}")
        return 0.0


def save_listings(listings: List[Dict[str, Any]]) -> int:
    """Save listings to database.
    
    Args:
        listings: List of listing dictionaries
        
    Returns:
        Number of new listings saved
    """
    new_count = 0
    
    with Session(engine) as db:
        for listing_data in listings:
            vin = listing_data.get("vin")
            if not vin:
                continue
            
            # Check if listing already exists
            existing = db.query(Listing).filter(Listing.vin == vin).first()
            if existing:
                # Update existing listing
                existing.attrs = listing_data
                existing.updated_at = datetime.utcnow()
            else:
                # Create new listing
                listing = Listing(
                    vin=vin,
                    source=listing_data.get("source", "unknown"),
                    attrs=listing_data
                )
                db.add(listing)
                new_count += 1
                
                # Queue enrichment task
                enrich_and_match.delay(vin)
        
        db.commit()
    
    return new_count 