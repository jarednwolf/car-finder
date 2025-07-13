"""Alert routes for fetching user alerts."""
import logging
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel

from app.database import get_db
from app.models.schemas import Alert, Preference, Listing, User


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/alerts", tags=["alerts"])


class DealerInfo(BaseModel):
    """Dealer information model."""
    name: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None


class ListingInfo(BaseModel):
    """Listing information for alerts."""
    vin: str
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    trim: Optional[str] = None
    price: Optional[float] = None
    mileage: Optional[int] = None
    exterior_color: Optional[str] = None
    listing_url: Optional[str] = None
    photos: List[str] = []
    dealer: DealerInfo


class AlertResponse(BaseModel):
    """Alert response model."""
    id: str
    listing: ListingInfo
    similarity_score: float
    created_at: datetime
    viewed_at: Optional[datetime] = None


@router.get("/feed", response_model=List[AlertResponse])
async def get_alerts_feed(
    user_id: Optional[UUID] = Query(None, description="User ID to filter alerts"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    only_unseen: bool = Query(False, description="Only return unseen alerts"),
    db: AsyncSession = Depends(get_db)
) -> List[AlertResponse]:
    """Get alerts feed for a user."""
    # Build query
    query = select(Alert).join(
        Preference
    ).join(
        Listing
    ).options(
        selectinload(Alert.listing),
        selectinload(Alert.preference)
    ).order_by(
        Alert.created_at.desc()
    )
    
    # Filter by user if provided
    if user_id:
        query = query.filter(Preference.user_id == user_id)
    
    # Filter by unseen if requested
    if only_unseen:
        query = query.filter(Alert.viewed_at.is_(None))
    
    # Apply pagination
    query = query.limit(limit).offset(offset)
    
    # Execute query
    result = await db.execute(query)
    alerts = result.scalars().all()
    
    # Transform to response format
    response_alerts = []
    for alert in alerts:
        listing_attrs = alert.listing.attrs
        
        listing_info = ListingInfo(
            vin=alert.listing.vin,
            make=listing_attrs.get("make"),
            model=listing_attrs.get("model"),
            year=listing_attrs.get("year"),
            trim=listing_attrs.get("trim"),
            price=listing_attrs.get("price"),
            mileage=listing_attrs.get("mileage"),
            exterior_color=listing_attrs.get("exterior_color"),
            listing_url=listing_attrs.get("listing_url"),
            photos=listing_attrs.get("photos", []),
            dealer=DealerInfo(**listing_attrs.get("dealer", {}))
        )
        
        response_alerts.append(AlertResponse(
            id=str(alert.id),
            listing=listing_info,
            similarity_score=alert.similarity_score,
            created_at=alert.created_at,
            viewed_at=alert.viewed_at
        ))
    
    return response_alerts


@router.post("/{alert_id}/mark-viewed")
async def mark_alert_viewed(
    alert_id: UUID,
    db: AsyncSession = Depends(get_db)
) -> dict:
    """Mark an alert as viewed."""
    result = await db.execute(
        select(Alert).where(Alert.id == alert_id)
    )
    alert = result.scalar_one_or_none()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.viewed_at = datetime.utcnow()
    await db.commit()
    
    return {"status": "success", "viewed_at": alert.viewed_at}


@router.get("/stats")
async def get_alert_stats(
    user_id: Optional[UUID] = Query(None, description="User ID to filter stats"),
    db: AsyncSession = Depends(get_db)
) -> dict:
    """Get alert statistics for a user."""
    # Base query
    query = select(Alert).join(Preference)
    
    if user_id:
        query = query.filter(Preference.user_id == user_id)
    
    result = await db.execute(query)
    alerts = result.scalars().all()
    
    # Calculate stats
    total_alerts = len(alerts)
    unseen_alerts = sum(1 for a in alerts if a.viewed_at is None)
    
    # Get alerts by day
    alerts_by_day = {}
    for alert in alerts:
        day = alert.created_at.date().isoformat()
        alerts_by_day[day] = alerts_by_day.get(day, 0) + 1
    
    return {
        "total_alerts": total_alerts,
        "unseen_alerts": unseen_alerts,
        "alerts_by_day": alerts_by_day
    } 