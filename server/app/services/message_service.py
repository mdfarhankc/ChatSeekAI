from typing import AsyncGenerator
from sqlmodel import Session
from uuid import UUID
from app.models.message import Message, MessageRole
from app.models.user import User
from app.schemas.message import MessageCreate
from app.repositories.message_repository import MessageRepository
from app.services.chat_service import ChatService
from app.services.ollama_service import OllamaService


class MessageService:
    """Service for message operations."""
    
    def __init__(self, session: Session):
        self.message_repo = MessageRepository(session)
        self.chat_service = ChatService(session)
        self.ollama_service = OllamaService()
        self.session = session
    
    def create_message(
        self, 
        chat_id: UUID, 
        message_data: MessageCreate,
        user: User
    ) -> Message:
        """Create a new message in a chat."""
        # Verify chat ownership
        self.chat_service.get_chat(chat_id, user)
        
        message_dict = message_data.model_dump()
        message_dict["chat_id"] = chat_id
        
        # Estimate token count (rough estimate)
        message_dict["tokens"] = len(message_data.content.split())
        
        message = self.message_repo.create(message_dict)
        
        # Update chat timestamp
        self.chat_service.update_chat_timestamp(chat_id)
        
        return message
    
    def get_chat_messages(
        self, 
        chat_id: UUID, 
        user: User,
        page: int = 1,
        page_size: int = 50
    ) -> tuple[list[Message], int]:
        """Get paginated messages for a chat."""
        # Verify chat ownership
        self.chat_service.get_chat(chat_id, user)
        
        skip = (page - 1) * page_size
        messages = self.message_repo.get_chat_messages(
            chat_id, 
            skip=skip, 
            limit=page_size
        )
        total = self.message_repo.count_chat_messages(chat_id)
        
        return messages, total
    
    async def generate_ai_response(
        self, 
        chat_id: UUID, 
        user_message: str,
        user: User
    ) -> AsyncGenerator[str, None]:
        """
        Generate AI response using Ollama and save messages.
        Yields response chunks as they're generated.
        """
        # Verify chat ownership and get chat details
        chat = self.chat_service.get_chat(chat_id, user)
        
        # Save user message
        user_msg = self.create_message(
            chat_id,
            MessageCreate(role=MessageRole.USER, content=user_message),
            user
        )
        
        # Get recent conversation context
        context_messages = self.message_repo.get_recent_context(chat_id, limit=10)
        
        # Format context for Ollama
        context = [
            {"role": msg.role.value, "content": msg.content}
            for msg in context_messages[:-1]  # Exclude the just-added message
        ]
        
        # Generate response
        full_response = ""
        
        async for chunk in self.ollama_service.generate_stream(
            prompt=user_message,
            model=chat.model,
            context=context,
            system_prompt=chat.system_prompt
        ):
            full_response += chunk
            yield chunk
        
        # Save assistant response
        if full_response:
            self.create_message(
                chat_id,
                MessageCreate(
                    role=MessageRole.ASSISTANT, 
                    content=full_response.strip()
                ),
                user
            )