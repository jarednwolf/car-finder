"""Chat routes for OpenAI integration."""
import json
import logging
from typing import Optional, AsyncGenerator
from uuid import UUID, uuid4
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
import openai
from openai import AsyncOpenAI

from app.config import settings
from app.database import get_db
from app.models.schemas import User, Conversation, Message, Preference, CarPreference
from app.chat.extract import extract_preferences
from app.chat.system_prompt import SYSTEM_PROMPT


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["chat"])

# Initialize OpenAI client
client = AsyncOpenAI(api_key=settings.openai_api_key)


class ChatRequest(BaseModel):
    """Chat request model."""
    message: str
    user_id: Optional[UUID] = None
    conversation_id: Optional[UUID] = None


class ChatResponse(BaseModel):
    """Chat response model."""
    conversation_id: UUID
    message_id: UUID


async def get_or_create_user(
    db: AsyncSession,
    user_id: Optional[UUID] = None,
    email: Optional[str] = None
) -> User:
    """Get existing user or create a new one."""
    if user_id:
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if user:
            return user
    
    # Create a dummy user for now (in production, this would come from auth)
    user = User(
        id=user_id or uuid4(),
        email=email or f"user_{uuid4().hex[:8]}@carfinder.ai"
    )
    db.add(user)
    await db.commit()
    return user


async def get_or_create_conversation(
    db: AsyncSession,
    user: User,
    conversation_id: Optional[UUID] = None
) -> Conversation:
    """Get existing conversation or create a new one."""
    if conversation_id:
        result = await db.execute(
            select(Conversation).where(
                Conversation.id == conversation_id,
                Conversation.user_id == user.id
            )
        )
        conversation = result.scalar_one_or_none()
        if conversation:
            return conversation
    
    # Create new conversation
    conversation = Conversation(user_id=user.id)
    db.add(conversation)
    await db.commit()
    return conversation


async def save_message(
    db: AsyncSession,
    conversation: Conversation,
    content: str,
    from_user: bool
) -> Message:
    """Save a message to the database."""
    message = Message(
        conversation_id=conversation.id,
        content=content,
        from_user=from_user
    )
    db.add(message)
    await db.commit()
    return message


async def get_conversation_history(
    db: AsyncSession,
    conversation: Conversation,
    limit: int = 20
) -> list[dict]:
    """Get conversation history as OpenAI messages format."""
    result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation.id)
        .order_by(Message.ts.desc())
        .limit(limit)
    )
    messages = result.scalars().all()
    
    # Convert to OpenAI format and reverse to get chronological order
    openai_messages = []
    for msg in reversed(messages):
        role = "user" if msg.from_user else "assistant"
        openai_messages.append({
            "role": role,
            "content": msg.content
        })
    
    return openai_messages


async def stream_openai_response(
    messages: list[dict],
    conversation: Conversation,
    db: AsyncSession
) -> AsyncGenerator[str, None]:
    """Stream OpenAI response and save to database."""
    full_response = ""
    
    try:
        # Add system prompt at the beginning
        all_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages
        
        # Stream from OpenAI
        stream = await client.chat.completions.create(
            model=settings.openai_model,
            messages=all_messages,
            temperature=settings.openai_temperature,
            stream=True,
            functions=[{
                "name": "save_preferences",
                "description": "Save the user's car preferences when they say 'save preferences' or similar",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "preferences": {
                            "type": "object",
                            "required": ["body_style", "drivetrain", "min_power_hp", "must_have_options"],
                            "properties": {
                                "body_style": {"type": "string", "enum": ["SUV", "Sedan", "Coupe", "Convertible", "Hatchback"]},
                                "drivetrain": {"type": "string", "enum": ["AWD", "RWD", "FWD"]},
                                "fuel_type": {"type": "string", "enum": ["Gas", "Hybrid", "PHEV", "EV"]},
                                "min_power_hp": {"type": "integer"},
                                "must_have_options": {"type": "array", "items": {"type": "string"}},
                                "budget_usd": {"type": "integer"},
                                "brand_exclusions": {"type": "array", "items": {"type": "string"}}
                            }
                        }
                    },
                    "required": ["preferences"]
                }
            }],
            function_call="auto"
        )
        
        function_call = None
        function_name = None
        function_args = ""
        
        async for chunk in stream:
            if not chunk.choices:
                continue
                
            delta = chunk.choices[0].delta
            
            # Handle function calls
            if delta.function_call:
                if delta.function_call.name:
                    function_name = delta.function_call.name
                if delta.function_call.arguments:
                    function_args += delta.function_call.arguments
                continue
            
            # Handle regular content
            if delta.content:
                content = delta.content
                full_response += content
                
                # Send as Server-Sent Event
                yield f"data: {json.dumps({'content': content})}\n\n"
        
        # Handle function call if present
        if function_name == "save_preferences" and function_args:
            try:
                args = json.loads(function_args)
                preferences_data = args.get("preferences", {})
                
                # Validate and save preferences
                car_pref = CarPreference(**preferences_data)
                
                # Create preference record
                preference = Preference(
                    user_id=conversation.user_id,
                    car_pref=car_pref.model_dump()
                )
                db.add(preference)
                await db.commit()
                
                # Send confirmation
                confirmation = "\n\n✅ I've saved your preferences! You'll start receiving alerts for matching vehicles."
                full_response += confirmation
                yield f"data: {json.dumps({'content': confirmation})}\n\n"
                
                # Send preference saved event
                yield f"data: {json.dumps({'event': 'preferences_saved', 'preference_id': str(preference.id)})}\n\n"
                
            except Exception as e:
                logger.error(f"Error saving preferences: {e}")
                error_msg = "\n\n❌ Sorry, I couldn't save your preferences. Please try again."
                full_response += error_msg
                yield f"data: {json.dumps({'content': error_msg})}\n\n"
        
        # Save assistant message
        await save_message(db, conversation, full_response, from_user=False)
        
        # Send end event
        yield f"data: {json.dumps({'event': 'end'})}\n\n"
        
    except Exception as e:
        logger.error(f"OpenAI streaming error: {e}")
        yield f"data: {json.dumps({'error': str(e)})}\n\n"


@router.post("/")
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
) -> StreamingResponse:
    """Handle chat messages with streaming response."""
    try:
        # Get or create user and conversation
        user = await get_or_create_user(db, request.user_id)
        conversation = await get_or_create_conversation(db, user, request.conversation_id)
        
        # Save user message
        await save_message(db, conversation, request.message, from_user=True)
        
        # Get conversation history
        history = await get_conversation_history(db, conversation)
        
        # Add current message
        history.append({"role": "user", "content": request.message})
        
        # Stream response
        return StreamingResponse(
            stream_openai_response(history, conversation, db),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Conversation-ID": str(conversation.id),
            }
        )
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{conversation_id}")
async def get_chat_history(
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db)
) -> list[dict]:
    """Get chat history for a conversation."""
    result = await db.execute(
        select(Conversation).where(Conversation.id == conversation_id)
    )
    conversation = result.scalar_one_or_none()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    history = await get_conversation_history(db, conversation, limit=100)
    return history 