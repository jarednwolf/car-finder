"""Auto.dev API client for fetching car listings."""
import logging
from typing import Optional, List, Dict, Any
from datetime import datetime
import httpx

from app.config import settings


logger = logging.getLogger(__name__)


class AutoDevClient:
    """Client for Auto.dev API."""
    
    BASE_URL = "https://auto.dev/api/v2"
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize client with API key."""
        self.api_key = api_key or settings.autodev_api_key
        if not self.api_key:
            logger.warning("Auto.dev API key not provided")
        
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
            "Content-Type": "application/json"
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
            logger.error("Auto.dev API key not configured")
            return []
        
        # Build request payload
        payload = {
            "location": {
                "zip": zip_code,
                "radius": radius
            },
            "pagination": {
                "limit": limit,
                "offset": offset
            },
            "filters": {}
        }
        
        # Add optional filters
        if "year_min" in filters:
            payload["filters"]["year_min"] = filters["year_min"]
        if "price_max" in filters:
            payload["filters"]["price_max"] = filters["price_max"]
        if "body_style" in filters:
            payload["filters"]["body_styles"] = [filters["body_style"]]
        if "make" in filters:
            payload["filters"]["makes"] = [filters["make"]]
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.BASE_URL}/listings/search",
                    headers=self.headers,
                    json=payload,
                    timeout=30.0
                )
                response.raise_for_status()
                
                data = response.json()
                listings = data.get("results", [])
                
                # Transform to our standard format
                transformed_listings = []
                for listing in listings:
                    transformed = self._transform_listing(listing)
                    if transformed:
                        transformed_listings.append(transformed)
                
                logger.info(f"Retrieved {len(transformed_listings)} listings from Auto.dev")
                return transformed_listings
                
        except httpx.HTTPError as e:
            logger.error(f"Auto.dev API error: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error fetching Auto.dev listings: {e}")
            return []
    
    def _transform_listing(self, raw_listing: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Transform Auto.dev listing to our standard format.
        
        Args:
            raw_listing: Raw listing from Auto.dev API
            
        Returns:
            Transformed listing dictionary or None if invalid
        """
        try:
            # Extract VIN
            vin = raw_listing.get("vin")
            if not vin or len(vin) != 17:
                return None
            
            # Extract vehicle details
            vehicle = raw_listing.get("vehicle", {})
            dealer = raw_listing.get("dealer", {})
            
            # Build transformed listing
            return {
                "vin": vin,
                "source": "autodev",
                "make": vehicle.get("make"),
                "model": vehicle.get("model"),
                "year": vehicle.get("year"),
                "trim": vehicle.get("trim"),
                "body_type": vehicle.get("body_style"),
                "drivetrain": vehicle.get("drivetrain"),
                "fuel_type": vehicle.get("fuel_type"),
                "engine": vehicle.get("engine_description"),
                "transmission": vehicle.get("transmission"),
                "exterior_color": vehicle.get("exterior_color"),
                "interior_color": vehicle.get("interior_color"),
                "price": raw_listing.get("price"),
                "mileage": raw_listing.get("mileage"),
                "dealer": {
                    "name": dealer.get("name"),
                    "city": dealer.get("city"),
                    "state": dealer.get("state"),
                    "zip": dealer.get("zip_code"),
                    "phone": dealer.get("phone"),
                    "website": dealer.get("website_url")
                },
                "listing_url": raw_listing.get("listing_url"),
                "photos": raw_listing.get("photos", []),
                "description": raw_listing.get("description"),
                "features": vehicle.get("features", []),
                "packages": vehicle.get("packages", []),
                "raw_data": raw_listing,
                "fetched_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error transforming Auto.dev listing: {e}")
            return None
    
    async def get_vin_details(self, vin: str) -> Optional[Dict[str, Any]]:
        """Get detailed information for a specific VIN.
        
        Args:
            vin: Vehicle Identification Number
            
        Returns:
            VIN details dictionary or None if not found
        """
        if not self.api_key:
            logger.error("Auto.dev API key not configured")
            return None
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.BASE_URL}/vin/{vin}",
                    headers=self.headers,
                    timeout=30.0
                )
                response.raise_for_status()
                
                return response.json()
                
        except httpx.HTTPError as e:
            logger.error(f"Auto.dev VIN lookup error: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error looking up VIN: {e}")
            return None


# Module-level function for easy import
async def get_listings(zip_code: str, radius: int = 50, **kwargs) -> List[Dict[str, Any]]:
    """Get listings from Auto.dev API.
    
    Args:
        zip_code: ZIP code to search around
        radius: Search radius in miles
        **kwargs: Additional parameters
        
    Returns:
        List of listing dictionaries
    """
    client = AutoDevClient()
    return await client.get_listings(zip_code, radius, **kwargs) 