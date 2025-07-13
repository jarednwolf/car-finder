"""Unit tests for chat functionality."""
import pytest
import json
from unittest.mock import patch, AsyncMock, MagicMock
from uuid import uuid4

import respx
from httpx import Response
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.models.schemas import User, Conversation, Message, CarPreference
from app.config import settings


# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    """Override database dependency for testing."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def test_user(db_session):
    """Create a test user."""
    user = User(email="test@example.com")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


class TestChatRoutes:
    """Test chat API routes."""
    
    @pytest.mark.asyncio
    @patch('app.chat.routes.client.chat.completions.create')
    async def test_chat_endpoint_success(self, mock_openai, test_user):
        """Test successful chat interaction."""
        # Mock OpenAI response
        mock_stream = AsyncMock()
        mock_chunk = MagicMock()
        mock_chunk.choices = [MagicMock()]
        mock_chunk.choices[0].delta.content = "Hello! I can help you find a car."
        mock_chunk.choices[0].delta.function_call = None
        
        async def mock_iter():
            yield mock_chunk
        
        mock_stream.__aiter__.return_value = mock_iter()
        mock_openai.return_value = mock_stream
        
        # Make request
        response = client.post(
            "/api/chat/",
            json={
                "message": "Hello",
                "user_id": str(test_user.id)
            }
        )
        
        assert response.status_code == 200
        assert response.headers["content-type"] == "text/event-stream"
    
    def test_chat_endpoint_invalid_request(self):
        """Test chat endpoint with invalid request."""
        response = client.post(
            "/api/chat/",
            json={}
        )
        
        assert response.status_code == 422
    
    def test_get_chat_history(self, test_user, db_session):
        """Test retrieving chat history."""
        # Create conversation and messages
        conversation = Conversation(user_id=test_user.id)
        db_session.add(conversation)
        db_session.commit()
        
        message1 = Message(
            conversation_id=conversation.id,
            content="Hello",
            from_user=True
        )
        message2 = Message(
            conversation_id=conversation.id,
            content="Hi! How can I help?",
            from_user=False
        )
        db_session.add_all([message1, message2])
        db_session.commit()
        
        # Get history
        response = client.get(f"/api/chat/history/{conversation.id}")
        
        assert response.status_code == 200
        history = response.json()
        assert len(history) == 2
        assert history[0]["role"] == "user"
        assert history[0]["content"] == "Hello"
        assert history[1]["role"] == "assistant"
        assert history[1]["content"] == "Hi! How can I help?"
    
    def test_get_chat_history_not_found(self):
        """Test retrieving non-existent chat history."""
        fake_id = uuid4()
        response = client.get(f"/api/chat/history/{fake_id}")
        
        assert response.status_code == 404


class TestPreferenceExtraction:
    """Test preference extraction functionality."""
    
    @pytest.mark.asyncio
    @patch('app.chat.extract.client.chat.completions.create')
    async def test_extract_preferences_success(self, mock_openai):
        """Test successful preference extraction."""
        from app.chat.extract import extract_preferences
        
        # Mock OpenAI response
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.function_call = MagicMock()
        mock_response.choices[0].message.function_call.arguments = json.dumps({
            "body_style": "SUV",
            "drivetrain": "AWD",
            "fuel_type": "Hybrid",
            "min_power_hp": 250,
            "must_have_options": ["Leather Seats", "Sunroof"],
            "budget_usd": 45000,
            "brand_exclusions": []
        })
        
        mock_openai.return_value = mock_response
        
        # Test extraction
        messages = [
            {"role": "user", "content": "I want an SUV with AWD"},
            {"role": "assistant", "content": "Great choice! Any specific features?"},
            {"role": "user", "content": "Leather seats and sunroof are must-haves"}
        ]
        
        result = await extract_preferences(messages)
        
        assert result is not None
        assert result.body_style == "SUV"
        assert result.drivetrain == "AWD"
        assert result.min_power_hp == 250
        assert "Leather Seats" in result.must_have_options
    
    def test_validate_preferences(self):
        """Test preference validation."""
        from app.chat.extract import validate_preferences
        
        # Valid preferences
        valid_prefs = {
            "body_style": "SUV",
            "drivetrain": "AWD",
            "min_power_hp": 250,
            "must_have_options": ["Leather Seats"]
        }
        
        is_valid, error = validate_preferences(valid_prefs)
        assert is_valid
        assert error is None
        
        # Invalid preferences - missing required field
        invalid_prefs = {
            "body_style": "SUV",
            "drivetrain": "AWD"
        }
        
        is_valid, error = validate_preferences(invalid_prefs)
        assert not is_valid
        assert "min_power_hp" in error
        
        # Invalid preferences - wrong type
        invalid_prefs2 = {
            "body_style": "SUV",
            "drivetrain": "AWD",
            "min_power_hp": "not a number",
            "must_have_options": []
        }
        
        is_valid, error = validate_preferences(invalid_prefs2)
        assert not is_valid


class TestChatIntegration:
    """Integration tests for chat functionality."""
    
    @pytest.mark.asyncio
    @respx.mock
    async def test_chat_with_preference_saving(self, test_user, db_session):
        """Test full chat flow with preference saving."""
        # Mock OpenAI API
        openai_route = respx.post("https://api.openai.com/v1/chat/completions").mock(
            return_value=Response(
                200,
                json={
                    "choices": [{
                        "message": {
                            "content": "I'll save your preferences now.",
                            "function_call": {
                                "name": "save_preferences",
                                "arguments": json.dumps({
                                    "preferences": {
                                        "body_style": "SUV",
                                        "drivetrain": "AWD",
                                        "min_power_hp": 250,
                                        "must_have_options": ["Leather Seats"],
                                        "budget_usd": 45000
                                    }
                                })
                            }
                        }
                    }]
                }
            )
        )
        
        # Send chat message
        response = client.post(
            "/api/chat/",
            json={
                "message": "save preferences",
                "user_id": str(test_user.id)
            }
        )
        
        assert response.status_code == 200
        
        # Check that preference was saved
        from app.models.schemas import Preference
        preference = db_session.query(Preference).filter(
            Preference.user_id == test_user.id
        ).first()
        
        assert preference is not None
        assert preference.car_pref["body_style"] == "SUV"
        assert preference.car_pref["drivetrain"] == "AWD"


if __name__ == "__main__":
    pytest.main([__file__, "-v"]) 