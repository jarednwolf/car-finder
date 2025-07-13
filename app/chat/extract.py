"""Extract car preferences from conversation using OpenAI function calling."""
import json
import logging
from typing import Optional
from openai import AsyncOpenAI

from app.config import settings
from app.models.schemas import CarPreference


logger = logging.getLogger(__name__)
client = AsyncOpenAI(api_key=settings.openai_api_key)


async def extract_preferences(messages: list[dict]) -> Optional[CarPreference]:
    """Extract car preferences from conversation history using function calling."""
    try:
        # System prompt for extraction
        extraction_prompt = """You are a car preference extraction assistant. 
        Analyze the conversation and extract the user's car preferences.
        Only extract preferences that were explicitly stated by the user."""
        
        # Prepare messages with extraction prompt
        extraction_messages = [
            {"role": "system", "content": extraction_prompt}
        ] + messages + [
            {"role": "user", "content": "Please extract my car preferences from our conversation."}
        ]
        
        # Call OpenAI with function definition
        response = await client.chat.completions.create(
            model=settings.openai_model,
            messages=extraction_messages,
            temperature=0.1,  # Lower temperature for more consistent extraction
            functions=[{
                "name": "extract_car_preferences",
                "description": "Extract car preferences from the conversation",
                "parameters": {
                    "type": "object",
                    "required": ["body_style", "drivetrain", "min_power_hp", "must_have_options"],
                    "properties": {
                        "body_style": {
                            "type": "string",
                            "enum": ["SUV", "Sedan", "Coupe", "Convertible", "Hatchback"],
                            "description": "The preferred body style of the car"
                        },
                        "drivetrain": {
                            "type": "string",
                            "enum": ["AWD", "RWD", "FWD"],
                            "description": "The preferred drivetrain configuration"
                        },
                        "fuel_type": {
                            "type": "string",
                            "enum": ["Gas", "Hybrid", "PHEV", "EV"],
                            "description": "The preferred fuel type"
                        },
                        "min_power_hp": {
                            "type": "integer",
                            "description": "Minimum required horsepower"
                        },
                        "must_have_options": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "List of must-have options/features"
                        },
                        "budget_usd": {
                            "type": "integer",
                            "description": "Maximum budget in USD"
                        },
                        "brand_exclusions": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "Brands to exclude from search"
                        }
                    }
                }
            }],
            function_call={"name": "extract_car_preferences"}
        )
        
        # Parse function call response
        if response.choices[0].message.function_call:
            function_args = json.loads(response.choices[0].message.function_call.arguments)
            
            # Validate and create CarPreference object
            car_pref = CarPreference(**function_args)
            return car_pref
            
    except Exception as e:
        logger.error(f"Error extracting preferences: {e}")
        return None


def validate_preferences(preferences: dict) -> tuple[bool, Optional[str]]:
    """Validate extracted preferences.
    
    Returns:
        tuple: (is_valid, error_message)
    """
    try:
        # Check required fields
        required_fields = ["body_style", "drivetrain", "min_power_hp", "must_have_options"]
        for field in required_fields:
            if field not in preferences:
                return False, f"Missing required field: {field}"
        
        # Validate min_power_hp
        if not isinstance(preferences["min_power_hp"], int) or preferences["min_power_hp"] < 0:
            return False, "min_power_hp must be a positive integer"
        
        # Validate must_have_options
        if not isinstance(preferences["must_have_options"], list):
            return False, "must_have_options must be a list"
        
        # Validate budget if present
        if "budget_usd" in preferences:
            if not isinstance(preferences["budget_usd"], int) or preferences["budget_usd"] < 0:
                return False, "budget_usd must be a positive integer"
        
        # Try to create CarPreference object
        CarPreference(**preferences)
        return True, None
        
    except Exception as e:
        return False, str(e) 