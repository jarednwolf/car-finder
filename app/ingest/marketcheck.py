"""Marketcheck API client for fetching car listings."""
import logging
from typing import Optional, List, Dict, Any
from datetime import datetime
import httpx

from app.config import settings


logger = logging.getLogger(__name__)


class MarketCheckClient:
    """Client for Marketcheck API."""
    
    BASE_URL = "https://marketcheck-prod.apigee.net/v2"
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize client with API key."""
        self.api_key = api_key or settings.marketcheck_api_key
        if not self.api_key:
            logger.warning("Marketcheck API key not provided")
        
        self.headers = {
            "Host": "marketcheck-prod.apigee.net",
            "Accept": "application/json"
        }
    
    async def get_listings(
        self,
        zip_code: str,
        radius: int = 50,
        limit: int = 100,
        offset: int = 0,
        **filters
    ) -> List[Dict[str, Any]]:
        """Get car listings for a given ZIP code and radius.
        
        Args:
            zip_code: ZIP code to search around
            radius: Search radius in miles
            limit: Maximum number of results
            offset: Pagination offset
            **filters: Additional filters (year_min, price_max, etc.)
        
        Returns:
            List of listing dictionaries
        """
        if not self.api_key:
            logger.error("Marketcheck API key not configured")
            return []
        
        params = {
            "api_key": self.api_key,
            "zip": zip_code,
            "radius": radius,
            "rows": limit,
            "start": offset,
            "include_facets": "false"
        }
        
        # Add optional filters
        if "year_min" in filters:
            params["year"] = f"{filters['year_min']}~"
        if "price_max" in filters:
            params["price"] = f"~{filters['price_max']}"
        if "body_type" in filters:
            params["body_type"] = filters["body_type"]
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.BASE_URL}/search/car/active",
                    headers=self.headers,
                    params=params,
                    timeout=30.0
                )
                response.raise_for_status()
                
                data = response.json()
                listings = data.get("listings", [])
                
                # Transform to our standard format
                transformed_listings = []
                for listing in listings:
                    transformed = self._transform_listing(listing)
                    if transformed:
                        transformed_listings.append(transformed)
                
                logger.info(f"Retrieved {len(transformed_listings)} listings from Marketcheck")
                return transformed_listings
                
        except httpx.HTTPError as e:
            logger.error(f"Marketcheck API error: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error fetching Marketcheck listings: {e}")
            return []
    
    def _transform_listing(self, raw_listing: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Transform Marketcheck listing to our standard format.
        
        Args:
            raw_listing: Raw listing from Marketcheck API
            
        Returns:
            Transformed listing dictionary or None if invalid
        """
        try:
            # Extract VIN
            vin = raw_listing.get("vin")
            if not vin or len(vin) != 17:
                return None
            
            # Build transformed listing
            return {
                "vin": vin,
                "source": "marketcheck",
                "make": raw_listing.get("build", {}).get("make"),
                "model": raw_listing.get("build", {}).get("model"),
                "year": raw_listing.get("build", {}).get("year"),
                "trim": raw_listing.get("build", {}).get("trim"),
                "body_type": raw_listing.get("build", {}).get("body_type"),
                "drivetrain": raw_listing.get("build", {}).get("drivetrain"),
                "fuel_type": raw_listing.get("build", {}).get("fuel_type"),
                "engine": raw_listing.get("build", {}).get("engine"),
                "transmission": raw_listing.get("build", {}).get("transmission"),
                "exterior_color": raw_listing.get("exterior_color"),
                "interior_color": raw_listing.get("interior_color"),
                "price": raw_listing.get("price"),
                "mileage": raw_listing.get("miles"),
                "dealer": {
                    "name": raw_listing.get("dealer", {}).get("name"),
                    "city": raw_listing.get("dealer", {}).get("city"),
                    "state": raw_listing.get("dealer", {}).get("state"),
                    "zip": raw_listing.get("dealer", {}).get("zip"),
                    "phone": raw_listing.get("dealer", {}).get("phone"),
                    "website": raw_listing.get("dealer", {}).get("website")
                },
                "listing_url": raw_listing.get("vdp_url"),
                "photos": raw_listing.get("media", {}).get("photo_links", []),
                "description": raw_listing.get("extra", {}).get("description"),
                "features": raw_listing.get("extra", {}).get("features", []),
                "raw_data": raw_listing,
                "fetched_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error transforming Marketcheck listing: {e}")
            return None


# Module-level function for easy import
async def get_listings(zip_code: str, radius: int = 50, **kwargs) -> List[Dict[str, Any]]:
    """Get listings from Marketcheck API.
    
    Args:
        zip_code: ZIP code to search around
        radius: Search radius in miles
        **kwargs: Additional parameters
        
    Returns:
        List of listing dictionaries
    """
    client = MarketCheckClient()
    return await client.get_listings(zip_code, radius, **kwargs) 